import { auth, hasAdminAccess } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.contentProject.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching content projects:", error);
    return NextResponse.json({ error: "Failed to fetch content projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, imageUrl, link, order, published } = body;

    if (!title || !slug || !description || !imageUrl || !link) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, description, imageUrl, link" },
        { status: 400 }
      );
    }

    const project = await prisma.contentProject.create({
      data: {
        title,
        slug,
        description,
        imageUrl,
        link,
        order: Number.isFinite(order) ? Number(order) : 0,
        published: published !== false,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating content project:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A content project with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create content project" }, { status: 500 });
  }
}
