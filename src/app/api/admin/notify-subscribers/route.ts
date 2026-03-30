import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const session = await auth();
  const passcodeAuth = req.cookies.get("admin-passcode-auth")?.value;
  
  // We need to allow either session or passcode authorization
  if (!session?.user?.email && passcodeAuth !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const subscribers = await prisma.subscriber.findMany();
  if (subscribers.length === 0) {
    return NextResponse.json({ message: "No subscribers yet", sent: 0 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ichaka.com.ng";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Send to all subscribers in one batch using Resend's batch send
  await resend.batch.send(
    subscribers.map((sub) => ({
      from: `Ichaka <blog@ichaka.com.ng>`,
      to: sub.email,
      subject: post.title,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">${post.title}</h1>
          ${post.excerpt ? `<p style="color: #666; margin-bottom: 16px;">${post.excerpt}</p>` : ""}
          <a href="${postUrl}" style="display: inline-block; padding: 10px 20px; background: #f97316; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Read post →</a>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">You're receiving this because you subscribed at ichaka.com.ng</p>
        </div>
      `,
    }))
  );

  return NextResponse.json({ message: "Emails sent", sent: subscribers.length });
}
