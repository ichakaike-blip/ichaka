import { auth, hasAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { writerId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    if (post.writerId) {
      const remainingPosts = await prisma.blogPost.count({ where: { writerId: post.writerId } });
      if (remainingPosts === 0) {
        await prisma.writer.delete({ where: { id: post.writerId } });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error rejecting submission:", error);
    return NextResponse.json({ error: "Failed to reject submission" }, { status: 500 });
  }
}
