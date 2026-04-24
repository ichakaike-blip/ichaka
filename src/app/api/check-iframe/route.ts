import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ embeddable: false }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const xFrameOptions = response.headers.get("x-frame-options")?.toLowerCase() || "";
    const csp = response.headers.get("content-security-policy")?.toLowerCase() || "";

    const isBlocked =
      xFrameOptions === "deny" ||
      xFrameOptions === "sameorigin" ||
      csp.includes("frame-ancestors 'none'") ||
      (csp.includes("frame-ancestors") && !csp.includes("https://ichaka.com.ng"));

    return NextResponse.json({ embeddable: !isBlocked });
  } catch (error) {
    console.error("Error checking iframe embeddability:", error);
    // If the request fails entirely, assume it's not embeddable
    return NextResponse.json({ embeddable: false });
  }
}
