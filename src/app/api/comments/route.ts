import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import {
  buildUnsubscribeToken,
  isValidEmail,
  normalizeEmail,
} from "@/lib/comment-notifications";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const resendFrom = process.env.RESEND_FROM || "Ichaka <blog@ichaka.com.ng>";

export async function POST(req: NextRequest) {
  const { postId, name, body, parentCommentId, email, notifyOnReply } = await req.json();

  if (!postId || !name?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);
  const wantsReplyNotifications = Boolean(notifyOnReply);

  if (normalizedEmail && !isValidEmail(normalizedEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  if (wantsReplyNotifications && !normalizedEmail) {
    return NextResponse.json(
      { error: "Email is required to enable reply notifications" },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        name: name.trim(),
        body: body.trim(),
        parentCommentId: parentCommentId || null,
        email: normalizedEmail,
        notifyOnReply: wantsReplyNotifications,
      },
      select: {
        id: true,
        postId: true,
        parentCommentId: true,
        name: true,
        body: true,
        createdAt: true,
      },
    });

    if (parentCommentId) {
      if (!resend) {
        console.error("Reply notification skipped: RESEND_API_KEY is not configured");
      }

      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId },
        select: {
          id: true,
          name: true,
          email: true,
          notifyOnReply: true,
          post: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      });

      if (resend && parentComment?.email && parentComment.notifyOnReply) {
        const snippet =
          comment.body.length > 140
            ? `${comment.body.slice(0, 140).trimEnd()}...`
            : comment.body;

        const postLink = `${siteUrl}/blog/${parentComment.post.slug}#comment-${comment.id}`;
        const unsubscribeToken = buildUnsubscribeToken(parentComment.id, parentComment.email);
        const unsubscribeLink = `${siteUrl}/api/comments/unsubscribe?commentId=${encodeURIComponent(parentComment.id)}&email=${encodeURIComponent(parentComment.email)}&token=${encodeURIComponent(unsubscribeToken)}`;

        try {
          const sendResult = await resend.emails.send({
            from: resendFrom,
            to: parentComment.email,
            subject: `New reply to your comment on ${parentComment.post.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #111827;">
                <h2 style="font-size: 20px; margin-bottom: 10px;">You have a new reply</h2>
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
                  <strong>${comment.name}</strong> replied to your comment:
                </p>
                <blockquote style="margin: 0 0 18px; padding: 12px 14px; border-left: 4px solid #f97316; background: #fff7ed; color: #7c2d12;">
                  ${snippet.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </blockquote>
                <p style="margin-bottom: 22px;">
                  <a href="${postLink}" style="display: inline-block; background: #f97316; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-weight: 600;">
                    Click here to view it
                  </a>
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                  If you no longer want reply notifications for this comment,
                  <a href="${unsubscribeLink}" style="color: #f97316;">unsubscribe here</a>.
                </p>
              </div>
            `,
          });

          if (sendResult.error) {
            console.error("Resend rejected reply notification", sendResult.error);
          } else {
            console.info("Reply notification sent", {
              commentId: comment.id,
              parentCommentId,
              to: parentComment.email,
            });
          }
        } catch (emailError) {
          console.error("Failed to send reply notification email", emailError);
        }
      } else {
        console.info("Reply notification skipped", {
          commentId: comment.id,
          parentCommentId,
          hasResend: Boolean(resend),
          parentCommentFound: Boolean(parentComment),
          parentHasEmail: Boolean(parentComment?.email),
          parentNotifyOnReply: Boolean(parentComment?.notifyOnReply),
          resendFrom,
        });
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
