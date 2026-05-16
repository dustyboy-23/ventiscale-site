"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createBrand, createSocialAccount } from "@/app/actions/social-scheduler";

type FormStatus = { kind: "idle" } | { kind: "error"; msg: string } | { kind: "success"; msg: string };

export function AddBrandForm({ teamSlug }: { teamSlug: string }) {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        formData.set("team_slug", teamSlug);
        startTransition(async () => {
          const res = await createBrand(formData);
          if (res.ok) {
            setStatus({ kind: "success", msg: "Brand added" });
            router.refresh();
            // Reset form
            (document.activeElement as HTMLElement | null)?.blur?.();
            setTimeout(() => setStatus({ kind: "idle" }), 2000);
          } else {
            setStatus({ kind: "error", msg: res.error });
          }
        });
      }}
      className="space-y-3"
    >
      <Field label="Brand slug" hint="lowercase, dashes only (e.g. cuddle-box)">
        <input
          name="slug"
          required
          pattern="[a-z0-9\-]{2,40}"
          placeholder="cuddle-box"
          className="form-input"
        />
      </Field>
      <Field label="Display name" hint="how it appears in the UI">
        <input
          name="name"
          required
          placeholder="Cuddle Box"
          className="form-input"
        />
      </Field>
      <Field label="Brand color (optional)" hint="hex like #6366F1">
        <input
          name="brand_color"
          pattern="#[0-9A-Fa-f]{6}"
          placeholder="#6366F1"
          className="form-input"
        />
      </Field>
      <FormFooter pending={pending} status={status} submitLabel="Add brand" />
    </form>
  );
}

const PLATFORM_HELP: Record<string, { handle: string; accountId: string; envExample: string }> = {
  tiktok:    { handle: "@cuddle.box2",  accountId: "cuddle.box2 (TikTok username, no @)",                 envExample: "~/.secure/cuddle-box-tiktok.env" },
  instagram: { handle: "@cuddlebox4u",  accountId: "17841... (IG Business Account ID, 17-digit number)",   envExample: "~/.secure/cuddle-box-fb.env" },
  facebook:  { handle: "Cuddle Box",    accountId: "1022782694262489 (FB Page ID)",                       envExample: "~/.secure/cuddle-box-fb.env" },
  linkedin:  { handle: "Venti Scale",   accountId: "urn:li:organization:12345678 (LI organization URN)",   envExample: "~/.secure/cuddle-box-linkedin.env" },
};

export function AddChannelForm({
  teamSlug,
  clientId,
  clientSlug,
}: {
  teamSlug: string;
  clientId: string;
  clientSlug: string;
}) {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [platform, setPlatform] = useState<keyof typeof PLATFORM_HELP>("tiktok");
  const router = useRouter();

  const help = PLATFORM_HELP[platform];

  return (
    <form
      action={(formData) => {
        formData.set("team_slug", teamSlug);
        formData.set("client_id", clientId);
        startTransition(async () => {
          const res = await createSocialAccount(formData);
          if (res.ok) {
            setStatus({ kind: "success", msg: "Channel connected" });
            router.refresh();
            setTimeout(() => setStatus({ kind: "idle" }), 2000);
          } else {
            setStatus({ kind: "error", msg: res.error });
          }
        });
      }}
      className="space-y-3"
    >
      <Field label="Platform">
        <select
          name="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as keyof typeof PLATFORM_HELP)}
          className="form-input"
        >
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
        </select>
      </Field>
      <Field label="Display handle" hint={`e.g. ${help.handle}`}>
        <input
          name="account_handle"
          required
          placeholder={help.handle}
          className="form-input"
        />
      </Field>
      <Field label="Account ID" hint={help.accountId}>
        <input
          name="account_id"
          required
          placeholder={help.accountId.split(" ")[0]}
          className="form-input font-mono text-[12px]"
        />
      </Field>
      <Field label="Credentials env path" hint={`Path to the .env file on the worker host. Default for ${clientSlug}: ${help.envExample}`}>
        <input
          name="credentials_env_path"
          required
          placeholder={help.envExample}
          defaultValue={help.envExample.replace("cuddle-box", clientSlug)}
          className="form-input font-mono text-[12px]"
        />
      </Field>
      <FormFooter pending={pending} status={status} submitLabel="Connect channel" />
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[12px] font-medium text-[var(--color-ink)] mb-1.5">{label}</div>
      {children}
      {hint && (
        <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">{hint}</div>
      )}
      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 0.625rem;
          padding: 0.55rem 0.75rem;
          font-size: 13px;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.form-input:focus) {
          border-color: var(--color-accent);
        }
      `}</style>
    </label>
  );
}

function FormFooter({
  pending,
  status,
  submitLabel,
}: {
  pending: boolean;
  status: FormStatus;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-black transition disabled:opacity-60"
      >
        {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />}
        {submitLabel}
      </button>
      {status.kind === "success" && (
        <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          {status.msg}
        </span>
      )}
      {status.kind === "error" && (
        <span className="inline-flex items-center gap-1.5 text-[12px] text-rose-700">
          <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
          {status.msg}
        </span>
      )}
    </div>
  );
}
