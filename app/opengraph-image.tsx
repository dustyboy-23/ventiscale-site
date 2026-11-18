import { ImageResponse } from "next/og";
import { SERVICES, money } from "@/lib/pricing";

export const runtime = "edge";
export const alt = "Venti Scale. Your competitor isn't better than you. They're just easier to find.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0F2E20";
const MOSS = "#51645A";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: INK,
        }}
      >
        {/* Left: brand + line */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 17,
                background: INK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="60" height="60" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8.4 10.6 L14.6 22.4 L23.8 8.4"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1.2 }}>Venti Scale</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: -2.2,
                maxWidth: 570,
              }}
            >
              Your competitor isn&apos;t better than you. They&apos;re just easier to find.
            </div>
            <div style={{ fontSize: 25, color: MOSS, maxWidth: 520, lineHeight: 1.35 }}>
              Done-for-you marketing. Flat monthly prices. No contract.
            </div>
          </div>
        </div>

        {/* Right: the rate sheet */}
        <div
          style={{
            width: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F2F6F1",
            padding: "0 44px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#FFFFFF",
              border: "2px solid rgba(15,46,32,0.2)",
              borderRadius: 24,
              padding: "14px 0",
            }}
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 28px",
                  borderTop: i === 0 ? "none" : "1.5px solid rgba(15,46,32,0.12)",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 600 }}>{s.perChannel ? "Ads, per channel" : s.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      background: "#FFE55C",
                      padding: "0 8px",
                      borderRadius: 5,
                    }}
                  >
                    {money(s.monthly)}
                  </div>
                  <div style={{ fontSize: 19, color: MOSS }}>/mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
