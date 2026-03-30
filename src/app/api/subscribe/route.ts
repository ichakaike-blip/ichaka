import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await prisma.subscriber.create({ data: { email } });
    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "You're already subscribed" });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
