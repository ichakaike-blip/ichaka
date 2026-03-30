import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteCommentButton from "@/components/admin/DeleteCommentButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PostCommentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="px-3 py-1 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground/80 rounded transition text-sm font-medium"
        >
          &larr; Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Comments</h1>
          <p className="text-foreground/60 text-sm">Post: {post.title}</p>
        </div>
      </div>

      {post.comments.length === 0 ? (
        <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10 text-center">
          <p className="text-foreground/60">No comments on this post yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 flex items-start justify-between gap-4 transition hover:border-foreground/20">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{comment.name}</span>
                  <span className="text-foreground/40 text-xs">
                    • {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">{comment.body}</p>
              </div>
              <DeleteCommentButton id={comment.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
