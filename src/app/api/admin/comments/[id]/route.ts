import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function isPrismaErrorWithCode(value: unknown): value is { code: string } {
  return typeof value === "object" && value !== null && "code" in value;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const passcodeAuth = req.cookies.get("admin-passcode-auth")?.value;
  
  if (!session?.user?.email && passcodeAuth !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.comment.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (isPrismaErrorWithCode(error) && error.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
