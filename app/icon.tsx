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
          background: "#1F3D2B",
          color: "#F6F1EA",
          fontSize: 42,
          fontWeight: 500,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          letterSpacing: -1,
          borderRadius: 12,
        }}
      >
        V
      </div>
    ),
    { ...size },
  );
}
