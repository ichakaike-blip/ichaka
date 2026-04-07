import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import {
  normalizeEmail,
  verifyUnsubscribeToken,
} from "@/lib/comment-notifications";
import { NextRequest } from "next/server";

function htmlResponse(content: string, status = 200) {
  return new Response(content, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: NextRequest) {
  const commentId = req.nextUrl.searchParams.get("commentId");
  const rawEmail = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");
  const email = normalizeEmail(rawEmail);

  if (!commentId || !email || !token) {
    return htmlResponse("<h2>Invalid unsubscribe link.</h2>", 400);
  }

  const isTokenValid = verifyUnsubscribeToken(commentId, email, token);
  if (!isTokenValid) {
    return htmlResponse("<h2>Invalid or expired unsubscribe token.</h2>", 400);
  }

  await prisma.comment.updateMany({
    where: {
      id: commentId,
      email,
    },
    data: {
      notifyOnReply: false,
    },
  });

  return htmlResponse(`
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; color: #111827;">
      <h2 style="margin-bottom: 10px;">Unsubscribed successfully</h2>
      <p style="line-height: 1.6; color: #374151; margin-bottom: 18px;">
        You will no longer receive reply notifications for this comment.
      </p>
      <a href="${siteUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 6px; font-weight: 600;">
        Back to ichaka.com.ng
      </a>
    </div>
  `);
}
