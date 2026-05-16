import { Instagram, Facebook, Linkedin } from "lucide-react";
import type { SocialPlatform } from "@/lib/social-queries";

// Lucide has IG/FB/LI icons; TikTok we render inline as SVG (lucide has no TikTok).
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

const PLATFORMS: Record<SocialPlatform, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  tiktok:    { label: "TikTok",    Icon: TikTokIcon },
  instagram: { label: "Instagram", Icon: Instagram  },
  facebook:  { label: "Facebook",  Icon: Facebook   },
  linkedin:  { label: "LinkedIn",  Icon: Linkedin   },
};

export function PlatformIcon({
  platform,
  size = 14,
}: {
  platform: SocialPlatform;
  size?: number;
}) {
  const p = PLATFORMS[platform];
  if (!p) return null;
  return (
    <span title={p.label} className="inline-flex items-center">
      <p.Icon className={`w-[${size}px] h-[${size}px] text-[var(--color-ink-muted)]`} />
    </span>
  );
}

export function PlatformIconList({
  platforms,
  size = 14,
}: {
  platforms: SocialPlatform[];
  size?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {platforms.map((p) => (
        <PlatformIcon key={p} platform={p} size={size} />
      ))}
    </div>
  );
}

export function getPlatformLabel(platform: SocialPlatform): string {
  return PLATFORMS[platform]?.label ?? platform;
}
