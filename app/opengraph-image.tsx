import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Venti Scale — Fire your marketing agency. Keep the growth.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#F6F1EA",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Subtle texture line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#1F3D2B",
          }}
        />

        {/* Top row: monogram + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#1F3D2B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F6F1EA",
              fontSize: 40,
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: -1,
            }}
          >
            V
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#1B1B1B",
                letterSpacing: -0.5,
              }}
            >
              Venti Scale
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#1B1B1B",
                opacity: 0.55,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Done-for-you marketing
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 82,
              fontWeight: 400,
              color: "#1B1B1B",
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 960,
            }}
          >
            Fire your marketing
            <br />
            agency.{" "}
            <span style={{ fontStyle: "italic", color: "#1F3D2B" }}>
              Keep the growth.
            </span>
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#1B1B1B",
              opacity: 0.65,
              lineHeight: 1.35,
              maxWidth: 860,
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Content, email, ads, SEO, reports. Run by AI, shipped daily,
            watched in your live portal.
          </div>
        </div>

        {/* Footer row: price + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(27, 27, 27, 0.12)",
            paddingTop: 28,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <div
              style={{
                fontSize: 44,
                fontWeight: 600,
                color: "#1B1B1B",
                letterSpacing: -1.5,
              }}
            >
              $1,500
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#1B1B1B",
                opacity: 0.55,
              }}
            >
              / month · flat · no contracts
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#1F3D2B",
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            ventiscale.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
