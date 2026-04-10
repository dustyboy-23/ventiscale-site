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
            "linear-gradient(135deg, #10E39A 0%, #5280FF 50%, #C8362B 100%)",
          borderRadius: 14,
          padding: 3,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#07080C",
            borderRadius: 11,
            color: "#FFFFFF",
            fontSize: 40,
            fontWeight: 700,
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: -1.5,
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size },
  );
}
