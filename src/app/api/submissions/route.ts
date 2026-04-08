import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toBaseSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function createUniqueSlug(title: string) {
  const base = toBaseSlug(title) || "post";
  let slug = base;
  let counter = 2;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = asTrimmedString(body?.name);
    const email = asTrimmedString(body?.email).toLowerCase();
    const bio = asTrimmedString(body?.bio);
    const postTitle = asTrimmedString(body?.postTitle);
    const postExcerpt = asTrimmedString(body?.postExcerpt);
    const postContent = asTrimmedString(body?.postContent);

    if (!name || !email || !bio || !postTitle || !postExcerpt || !postContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const postSlug = await createUniqueSlug(postTitle);

    const avatarUrl = asTrimmedString(body?.avatarUrl);
    const twitter = asTrimmedString(body?.twitter);
    const linkedin = asTrimmedString(body?.linkedin);
    const substack = asTrimmedString(body?.substack);
    const website = asTrimmedString(body?.website);
    const coverImage = asTrimmedString(body?.coverImage);

    const writer = await prisma.writer.create({
      data: {
        name,
        email,
        bio,
        avatar: avatarUrl || null,
        socials: JSON.stringify({ twitter, linkedin, substack, website }),
      },
    });

    await prisma.blogPost.create({
      data: {
        title: postTitle,
        slug: postSlug,
        excerpt: postExcerpt,
        content: postContent,
        coverImage: coverImage || null,
        status: "pending",
        published: false,
        publishedAt: null,
        writerId: writer.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to submit post" }, { status: 500 });
  }
}
