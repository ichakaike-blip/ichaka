import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL("/admin/login", req.url);
  const response = NextResponse.redirect(url);
  response.cookies.set("admin-passcode-auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
