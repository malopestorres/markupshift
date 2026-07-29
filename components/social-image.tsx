import { ImageResponse } from "next/og";

const socialImageSize = {
  width: 1200,
  height: 630,
};

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 78px",
          color: "#f4f1ea",
          background:
            "radial-gradient(circle at 75% 0%, #3b2a6b 0%, #15121f 38%, #0b0a0f 78%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              color: "#0b0a0f",
              background: "#f4f1ea",
              fontSize: 27,
              fontWeight: 800,
            }}
          >
            {"{ }"}
          </div>
          <div style={{ fontSize: 31, fontWeight: 700 }}>MarkupShift</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#c4b5fd",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Browser-native developer tool
          </div>
          <div
            style={{
              maxWidth: 950,
              marginTop: 19,
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            Convert HTML into clean React components.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#aaa5b5",
            fontSize: 22,
          }}
        >
          <span>JSX · TSX · Multi-file ZIP</span>
          <span style={{ color: "#70e0a6" }}>Private by design</span>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
