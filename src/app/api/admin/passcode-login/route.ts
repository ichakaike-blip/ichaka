import { ADMIN_PASSCODE } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body?.code ?? "");

    if (code !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-passcode-auth", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 5,
    });

    return response;
  } catch (error) {
    console.error("Passcode login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
