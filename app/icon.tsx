import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Same mark as components/marketing/logo.tsx: a V drawn as a tick.
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
          background: "#0F2E20",
          borderRadius: 18,
        }}
      >
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <path
            d="M8.4 10.6 L14.6 22.4 L23.8 8.4"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
