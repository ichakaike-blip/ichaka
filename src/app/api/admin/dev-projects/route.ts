import { auth, hasAdminAccess } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.devProject.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching development projects:", error);
    return NextResponse.json({ error: "Failed to fetch development projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, link, imageUrl, order, published } = body;

    if (!title || !slug || !description || !link) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, description, link" },
        { status: 400 }
      );
    }

    const project = await prisma.devProject.create({
      data: {
        title,
        slug,
        description,
        link,
        imageUrl: imageUrl || null,
        order: Number.isFinite(order) ? Number(order) : 0,
        published: published !== false,
      },
    });

    revalidatePath("/dev-projects", "layout");
    revalidatePath("/skills/development");
    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating development project:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A development project with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create development project" }, { status: 500 });
  }
}
