import { auth, hasAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.blogPost.update({
      where: { id },
      data: {
        status: "published",
        published: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error approving submission:", error);
    return NextResponse.json({ error: "Failed to approve submission" }, { status: 500 });
  }
}
