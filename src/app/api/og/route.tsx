import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "ichaka";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#09090b",
          color: "#f4f4f5",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, color: "#f59e0b" }}>ichaka.com.ng</div>
        <div style={{ marginTop: 24, fontSize: 76, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
