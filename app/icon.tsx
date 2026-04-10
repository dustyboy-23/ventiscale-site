import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 55%, rgba(224,74,62,0.55) 0%, rgba(200,54,43,0.2) 45%, #07080C 75%)",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 44,
            fontWeight: 700,
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: -2,
            textShadow:
              "0 0 18px rgba(224,74,62,0.95), 0 0 38px rgba(224,74,62,0.55)",
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size },
  );
}
