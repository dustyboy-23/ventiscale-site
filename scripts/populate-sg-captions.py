#!/usr/bin/env python3
"""
One-shot: write captions + first-comment suggestions onto the existing
20 Sprinkler Guard content_items rows. Match rows by topic substring
in title (the bit at the end of "<date> - Day N <AM|PM> - <topic>").

These are first-draft placeholders Dusty can edit. They give the portal
something to render so Ken sees the full layout (caption above image,
first-reply below).

Idempotent: re-running just rewrites the same body/comments. Safe to
run multiple times. Skips rows whose body has been manually edited
(non-empty AND doesn't match the placeholder we wrote).

Usage:
    python scripts/populate-sg-captions.py --dry-run
    python scripts/populate-sg-captions.py --confirm

Requires:
    NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local.
    Migration 20260427_04_content_comments.sql applied to prod.
"""

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

# topic_key -> {body, comments}
# Match is by substring in title. Each draft's title is the cleaned
# filename, e.g. "2026-04-28 - Day 5 PM - hose-attachment".
DRAFTS: dict[str, dict] = {
    "hose-attachment": {
        "body": (
            "If your garden hose connection always sticks, the threading on your spigot is "
            "worn down. Pliers and a folded rag will break it loose without rounding the brass.\n\n"
            "Most outdoor spigots from before 2015 are due for replacement anyway. Quick check: "
            "wiggle yours side to side. If it moves at all, it's leaking inside the wall."
        ),
        "comments": [
            "We replace spigots for $90 flat including parts. Reply YES if yours is one of the offenders.",
        ],
    },
    "faucet-drip": {
        "body": (
            "Your dripping outdoor faucet is wasting about 700 gallons a year and rotting the "
            "sill plate behind it. The fix is usually a $4 washer, ten minutes of work.\n\n"
            "Drip from the spout = washer. Drip from the handle = packing nut needs tightening. "
            "Different problem, different fix."
        ),
        "comments": [
            "DM us a photo of where the drip is and we'll tell you which fix you need. No charge.",
        ],
    },
    "edge-trimmer": {
        "body": (
            "Cheapest yard upgrade most homeowners skip: an edge trimmer along sidewalks and "
            "driveways. Fifteen minutes a month and your whole property looks professionally "
            "maintained.\n\n"
            "Battery trimmers under $80 are fine for most lawns. Save the gas-powered ones for "
            "anyone with a thousand feet of edging."
        ),
        "comments": [
            "We add edge trimming to any monthly mow for $20. Reply EDGE if you want it on the schedule.",
        ],
    },
    "driveway-crack": {
        "body": (
            "Hairline cracks in your driveway grow about 3x every winter. Sealing them now in "
            "spring costs $30 in materials. Letting them go costs you a $4,000 repour in five years.\n\n"
            "Use a self-leveling polyurethane sealant. Skip the asphalt-emulsion stuff at Home Depot, "
            "it shrinks back out within a year."
        ),
        "comments": [
            "We do driveway crack sealing as an add-on for $250 typical lot. Reply DRIVEWAY for a quote.",
        ],
    },
    "smart-timer": {
        "body": (
            "Your sprinkler timer is probably set wrong. Most homes water deep and infrequent, but "
            "factory defaults run shallow and daily. That trains roots near the surface and kills "
            "your lawn in July.\n\n"
            "Right schedule for typical clay-soil yards: 30 minutes per zone, 3 days a week, 5am. "
            "Deep enough to soak the root zone, infrequent enough that grass grows roots looking for water."
        ),
        "comments": [
            "DM us your zone count and we'll send you the exact program for your soil type. Free.",
        ],
    },
    "mulch-volcano": {
        "body": (
            "Hot take: the mulch volcanoes piled against tree trunks are killing your trees. "
            "Mulch should be 2-3 inches deep and pulled back at least 2 inches from the trunk. "
            "That's it.\n\n"
            "Volcano mulching traps moisture against the bark, invites pests, and rots the root "
            "flare. Half the dying trees we see in older neighborhoods got that way from mulch."
        ),
        "comments": [
            "Replacing yours? We do mulch refresh at $4/bag installed. Reply MULCH for a yard estimate.",
        ],
    },
    "lawn-rust": {
        "body": (
            "If your lawn is leaving orange dust on your shoes, that's rust fungus. It means "
            "you're watering at night and the grass stays wet too long.\n\n"
            "Switch to morning watering, mow at 3+ inches, and it clears up in two weeks. No "
            "fungicide needed for mild cases."
        ),
        "comments": [
            "Resistant strains for next time: tall fescue and bluegrass mixes. Pure perennial rye gets rust easy.",
        ],
    },
    "roses-water": {
        "body": (
            "Roses don't want daily watering. They want a deep soak twice a week, AT THE BASE, "
            "not on the leaves.\n\n"
            "Wet leaves = black spot, and once you've got black spot you'll fight it for years. "
            "Drip irrigation under the mulch is the move."
        ),
        "comments": [
            "Drip irrigation parts run ~$60. We install for $180 if you want it done in an afternoon.",
        ],
    },
    "fertilizer-timing": {
        "body": (
            "First fertilizer of the year goes down when your forsythia blooms, NOT when the "
            "calendar says May 1.\n\n"
            "Forsythia tracks soil temperature better than any date. If yours hasn't bloomed yet, "
            "the soil is still too cold for fertilizer to be absorbed. You'd just be running it off "
            "in the spring rain."
        ),
        "comments": [
            "Slow-release granular only this early. Liquid fertilizer waits until late May.",
        ],
    },
    "pruning-timing": {
        "body": (
            "Spring pruning rule that nobody teaches you: anything that flowers in spring "
            "(forsythia, lilac, azalea) gets pruned right AFTER it blooms.\n\n"
            "Anything that flowers in summer (hydrangea, butterfly bush) gets pruned NOW before "
            "new growth starts. Mix this up and you cut off next year's flowers."
        ),
        "comments": [
            "Not sure what's what in your yard? Send us a photo. Free ID, no quote required.",
        ],
    },
    "aeration": {
        "body": (
            "Fall aeration is more important than spring aeration. But if you're only doing it "
            "once a year, do it in May before the lawn stresses out from summer heat.\n\n"
            "Core aeration only. The spike-aerator shoes at Home Depot actually make compaction "
            "worse, not better."
        ),
        "comments": [
            "We do plug aeration at $0.04/sqft. Reply AERATE for a quote on your lot.",
        ],
    },
    "tool-sharpen": {
        "body": (
            "Your pruners haven't been sharpened in three years. Dull blades crush stems instead "
            "of cutting them, leaving the plant open to disease.\n\n"
            "Two minutes with a $15 sharpening stone fixes it. Honing oil plus a 1000-grit "
            "diamond stone, both under $25 total."
        ),
        "comments": [
            "Skip the electric sharpeners. They take too much steel off and shorten the life of the blades.",
        ],
    },
    "valve-leak": {
        "body": (
            "If one zone of your sprinklers won't shut off (or runs randomly when you're not "
            "running it), the diaphragm in that zone's valve is shot.\n\n"
            "$12 part, 20 minutes of work, IF you can find your valve box. Most homeowners can't, "
            "and that's the actual hard part of this job."
        ),
        "comments": [
            "We locate buried valve boxes and replace diaphragms for $80/each including parts. Reply VALVE.",
        ],
    },
    "garage-spring": {
        "body": (
            "If your garage door sounds like a freight train, the torsion spring is at the end of "
            "its life. Average spring lasts 7-10 years and they always go in pairs.\n\n"
            "Don't try to replace it yourself. Torsion springs store enough force to break a wrist "
            "or worse. This is one of the few DIY projects we'll actually tell you to skip."
        ),
        "comments": [
            "We don't do garage doors but my guy is honest. DM us if you need a referral.",
        ],
    },
    "tomato-cage": {
        "body": (
            "The wire tomato cages from the hardware store are too small for any tomato worth "
            "growing. Indeterminate varieties hit eight feet by August.\n\n"
            "Build a cage from concrete remesh: $12 in materials, 10 minutes of bending, lasts "
            "twenty years. Or use t-posts and twine if you don't want a permanent cage."
        ),
        "comments": [
            "Determinate varieties stay around 4 feet. If you don't know which kind you planted, look it up by variety name.",
        ],
    },
    "deck-seal": {
        "body": (
            "Your deck needs sealing every 2-3 years. If water doesn't bead on the surface "
            "anymore, you're past due.\n\n"
            "Pressure wash, dry 48 hours, two coats of penetrating oil-based sealer. Stay away "
            "from solid stains on a deck. They peel and you'll be sanding it down in 18 months."
        ),
        "comments": [
            "Semi-transparent or clear penetrating sealers only. Anything else and you'll regret it next spring.",
        ],
    },
    "dryer-vent": {
        "body": (
            "Your dryer vent should be cleaned every year. Lint buildup is the #1 cause of "
            "laundry-room fires, AND it's why your clothes take three cycles to dry.\n\n"
            "If your dryer feels hot to touch on the outside, the vent is clogged. Don't put it "
            "off any longer than that."
        ),
        "comments": [
            "We do dryer vent cleaning at $89. Most folks save it back in dryer-energy within six months.",
        ],
    },
    "bird-feeder": {
        "body": (
            "Squirrels figured out your bird feeder in eight days. Two real fixes: a baffle on "
            "the pole, or a metal feeder with weight-activated perches that close under squirrel "
            "weight.\n\n"
            "Cheap plastic feeders aren't worth the headache. Steel feeders run $35-50 and last "
            "forever."
        ),
        "comments": [
            "Pro move: hang the feeder at least 10 feet from anything a squirrel can launch off of.",
        ],
    },
    "Pressure-Washer-Myth": {
        "body": (
            "Common myth: 'a pressure washer cleans everything.' Reality: too much PSI strips "
            "paint off siding, blasts mortar out of brick, and shreds softwood.\n\n"
            "1500 PSI is plenty for siding and decks. 3000+ is for concrete only. Buying the "
            "biggest one in the store is how people destroy their house."
        ),
        "comments": [
            "Hot water pressure washers work better than cold for grease. Cold is fine for everything else.",
        ],
    },
    "Yard-vs-Truck": {
        "body": (
            "Why we don't park our equipment in your driveway: tracked-on hydraulic fluid stains "
            "concrete permanently. Our truck has a drip tray, your driveway doesn't.\n\n"
            "Small detail. Real damage prevented. Most companies don't think about it. We do."
        ),
        "comments": [
            "We park on the street unless your driveway is really long. Just one of those things.",
        ],
    },
}


def load_env_local() -> None:
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def supabase_request(
    method: str,
    path: str,
    *,
    base_url: str,
    service_key: str,
    headers: Optional[dict] = None,
    body: Optional[dict] = None,
) -> dict:
    url = f"{base_url}{path}"
    h = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            raw = response.read()
            if not raw:
                return {}
            return json.loads(raw)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()[:500] if exc.fp else ""
        raise SystemExit(f"HTTP {exc.code} on {method} {path}: {detail}")


SG_CLIENT_ID = "12baae15-9b58-464e-9b21-a15f375ff979"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--confirm", action="store_true")
    args = parser.parse_args()
    if not args.dry_run and not args.confirm:
        print("Pass --dry-run to preview or --confirm to write.")
        return 1

    load_env_local()
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not base_url or not service_key:
        print("ERROR: env vars missing")
        return 1

    rows = supabase_request(
        "GET",
        f"/rest/v1/content_items?client_id=eq.{SG_CLIENT_ID}&drive_file_id=not.is.null&select=id,title,body,comments",
        base_url=base_url,
        service_key=service_key,
    )
    if not isinstance(rows, list):
        print("Unexpected response shape")
        return 1

    matched = 0
    skipped_edited = 0
    unmatched_topics = []
    for row in rows:
        title = row.get("title", "")
        match_key = next((k for k in DRAFTS if k.lower() in title.lower()), None)
        if not match_key:
            unmatched_topics.append(title)
            continue
        existing_body = (row.get("body") or "").strip()
        # Heuristic: if body is non-empty AND doesn't look like our placeholder
        # (we'd recognize a phrase), consider it user-edited and skip.
        if existing_body and not any(
            phrase in existing_body
            for phrase in (
                "your garden hose connection",
                "Your dripping outdoor faucet",
                "Cheapest yard upgrade",
                "Hairline cracks",
                "Your sprinkler timer",
                "Hot take",
                "If your lawn is leaving",
                "Roses don't want",
                "First fertilizer",
                "Spring pruning rule",
                "Fall aeration",
                "Your pruners",
                "If one zone",
                "If your garage door",
                "The wire tomato cages",
                "Your deck needs sealing",
                "Your dryer vent",
                "Squirrels figured out",
                "'a pressure washer",
                "Why we don't park",
            )
        ):
            print(f"  [skip user-edited] {title[:55]}")
            skipped_edited += 1
            continue

        payload = DRAFTS[match_key]
        action = "PATCH" if not args.dry_run else None
        print(f"  -> {title[:55]:55s}  [{match_key}]")
        if action:
            supabase_request(
                "PATCH",
                f"/rest/v1/content_items?id=eq.{row['id']}",
                base_url=base_url,
                service_key=service_key,
                headers={"Prefer": "return=minimal"},
                body={"body": payload["body"], "comments": payload["comments"]},
            )
        matched += 1

    print()
    print(f"Matched: {matched}    Skipped (user-edited): {skipped_edited}")
    if unmatched_topics:
        print(f"Unmatched titles ({len(unmatched_topics)}):")
        for t in unmatched_topics:
            print(f"  - {t}")
    if args.dry_run:
        print("\nDry run. Re-run with --confirm to write.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
