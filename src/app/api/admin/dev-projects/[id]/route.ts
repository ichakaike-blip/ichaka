import { auth, hasAdminAccess } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const project = await prisma.devProject.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: "Development project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching development project:", error);
    return NextResponse.json({ error: "Failed to fetch development project" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!hasAdminAccess(session?.user?.email, req.cookies.get("admin-passcode-auth")?.value ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, link, imageUrl, order, published } = body;
    const { id } = await params;

    const project = await prisma.devProject.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(link !== undefined && { link }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(order !== undefined && { order: Number(order) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    revalidatePath("/dev-projects", "layout");
    revalidatePath("/skills/development");
    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error("Error updating development project:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Development project not found" }, { status: 404 });
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A development project with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update development project" }, { status: 500 });
  }
}

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
    await prisma.devProject.delete({ where: { id } });

    revalidatePath("/dev-projects", "layout");
    revalidatePath("/skills/development");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting development project:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Development project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete development project" }, { status: 500 });
  }
}
