"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Ban, AlertCircle } from "lucide-react";
import { cancelScheduledPost } from "@/app/actions/social-scheduler";

export function CancelButton({
  teamSlug,
  postId,
}: {
  teamSlug: string;
  postId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Cancel this scheduled post? Cannot be undone — you'd have to compose a new one.")) {
            return;
          }
          startTransition(async () => {
            const fd = new FormData();
            fd.set("team_slug", teamSlug);
            fd.set("id", postId);
            const res = await cancelScheduledPost(fd);
            if (res.ok) {
              router.refresh();
            } else {
              setError(res.error);
            }
          });
        }}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
        ) : (
          <Ban className="w-3.5 h-3.5" strokeWidth={2.5} />
        )}
        Cancel this post
      </button>
      {error && (
        <div className="flex items-start gap-1.5 text-[11px] text-rose-700">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={2.5} />
          {error}
        </div>
      )}
    </div>
  );
}
