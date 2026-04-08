import { auth, hasAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  try {
    await prisma.writer.update({
      where: { id },
      data: { email: rawEmail },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update writer email" }, { status: 500 });
  }
}
