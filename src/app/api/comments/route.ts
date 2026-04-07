import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { postId, name, body, parentCommentId } = await req.json();

  if (!postId || !name?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        name: name.trim(),
        body: body.trim(),
        parentCommentId: parentCommentId || null,
      },
      include: {
        replies: true,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
