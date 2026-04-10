import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Venti Scale. Fire your marketing agency. Keep the growth.";
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
          padding: "80px 96px",
          background:
            "radial-gradient(circle at 20% 0%, rgba(16,227,154,0.14) 0%, rgba(7,8,12,0) 45%), radial-gradient(circle at 95% 100%, rgba(200,54,43,0.22) 0%, rgba(7,8,12,0) 55%), #07080C",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Top row: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #10E39A 0%, #5280FF 50%, #C8362B 100%)",
              padding: 3,
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 11,
                background: "#07080C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: -1.5,
              }}
            >
              V
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: -0.4,
              }}
            >
              Venti Scale
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(245,246,250,0.55)",
                letterSpacing: 2.2,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Done-for-you marketing
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -3,
              lineHeight: 1.02,
              maxWidth: 1000,
            }}
          >
            Fire your marketing
            <br />
            agency.{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(245,246,250,0.55)",
              }}
            >
              Keep the growth.
            </span>
          </div>

          <div
            style={{
              fontSize: 24,
              color: "rgba(245,246,250,0.7)",
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            Content, email, ads, SEO and reports, run by AI, shipped daily,
            watched in your live portal.
          </div>
        </div>

        {/* Footer row: pills + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["Custom plan", "Live portal", "No contracts"].map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "rgba(245,246,250,0.85)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999,
                  padding: "10px 20px",
                  letterSpacing: -0.2,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#10E39A",
              fontWeight: 600,
              letterSpacing: 0.3,
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
