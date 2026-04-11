# Client Security Script
**For when a client asks about data safety, leaks, privacy, or "what if you get hacked"**

This is what you actually say. Not corporate copy. Use the short version first. Only go deeper if they push.

---

## The 20-second version (default)

> Alright so the way I set it up, your data lives in its own locked box. Nobody else who uses Venti Scale can see it. Not the other clients, not random visitors, not even the dashboard itself unless it's proving it's you first. Your reports, your metrics, your funnel stuff, all of it sits behind a login that only you control.
>
> If you ever wanna leave, you take your data with you and I nuke the rest. That's the whole deal.

That's usually enough. Most people just want to know you thought about it.

---

## The 1-minute version (if they push)

> Okay so here's how it works. When you log in, you get a magic link to your email. That login gets you into your workspace and only your workspace. The database has a rule baked in at the lowest level that says "this user only sees rows tied to this client." Even if I screwed up the code tomorrow, the database itself would still block it. That's the actual safety net.
>
> Your data lives on Supabase, which is built on Postgres, which is what banks use. Not some sketchy startup database. The keys to the admin side of it are in one place, on my machine, never in the code, never in the repo, never visible to anyone who isn't me.
>
> The portal's hosted on Vercel. Every connection's encrypted. No data ever moves over plain HTTP.
>
> And I don't keep anything I don't need. No credit card stuff, no SSNs, just the marketing numbers we're actually using to help you grow.

---

## The "what if" answers

Clients ask the same five things. Memorize these.

### "What if someone hacks into my account?"
> You'd get a magic link email every time somebody tries to log in. If you didn't request it, don't click it. That's it. There's no password to steal because there's no password to begin with. Attacker needs access to your actual inbox, and at that point you've got bigger problems than your marketing dashboard.

### "What if you get hacked?"
> If somebody got into my side of things, the database would still block them from reading your rows because the rule's set at the database level. They'd need my admin keys AND they'd need to figure out how to use em. And I keep those keys in one spot, rotated when anything weird happens. I've tested it. The hack-from-the-top path is closed.

### "Who else can see my data?"
> Nobody. Literally nobody. Not other clients, not my workers, not a VA. I'm the only human with admin access and I only use it to set things up or fix things when something breaks. I don't sit there reading your revenue numbers for fun. My own dashboard shows me the same stuff yours shows you.

### "What if I wanna leave?"
> You get all your data exported and I wipe the rest. Usually takes me an afternoon. No retention games, no "oh you still owe us for three months." You decide you're out, you're out clean.

### "Do you sell or share my data with anyone?"
> No. Never. I don't have ad partners, I don't have affiliate trackers dropping cookies, I don't have an email list I'm feeding your info into. Your data is for running your marketing and that's the only thing it's for.

---

## If they ask the technical stuff

Some clients have a tech person in their ear. If the question gets specific, you can name-drop:

- **"Row-level security."** That's the database rule I mentioned. Every table has it. Every read is scoped to the logged-in user. Writes are locked down so even a buggy admin page couldn't accidentally expose anything.
- **"Magic link auth via Supabase."** Same auth that plenty of YC-backed SaaS companies use. Not something I wrote from scratch.
- **"Hosted on Vercel, database on Supabase."** Both are SOC 2 compliant. I'm not running a server in my garage.
- **"No passwords stored, no sessions in localStorage."** Session lives in an httpOnly cookie that JavaScript can't touch. Standard XSS defense.

Don't volunteer any of this. Only use it if they ask a technical question directly. Leading with it makes you sound defensive.

---

## What NOT to say

These are things that sound reassuring but actually hurt trust.

- **"We take security very seriously."** Every hacked company says this. Dead phrase.
- **"Military-grade encryption."** Marketing cliche. Means nothing.
- **"100% secure."** Nothing is 100% secure and saying so makes you sound dumb.
- **"Your data is safe with us."** Vague. Doesn't answer anything.
- **"We've never been breached."** Tempting fate AND implies you're counting.
- **"Enterprise-grade."** Corporate nonsense word. Means nothing.

---

## The deflection move

If someone's grilling you and you don't know the answer, do this:

> Honestly, I don't know off the top of my head. Let me go look at my setup and send you an actual answer tonight. I'd rather give you a real one than make something up.

Then actually go look it up and come back with the answer within the day. That builds more trust than faking expertise.

---

## The ongoing trust play

Send clients a one-paragraph "how your data is handled" update once a quarter. Not because you have to. Because nobody else does it and it makes you look like the adult in the room.

Template:
> Quick update on the boring-but-important side. Last quarter I did a full walkthrough of how your data's protected in the Venti Scale portal. Everything's locked down the way it should be. Your stuff is only visible to you, the keys to the admin side are where they should be, and the portal runs on encrypted connections end-to-end. If you ever want the technical version, I'll send it. Otherwise, back to the marketing.

That's it. Two to three sentences. Zero drama.
