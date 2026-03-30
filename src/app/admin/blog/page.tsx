import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/admin/DeletePostButton";
import TogglePostPublishedButton from "../../../components/admin/TogglePostPublishedButton";
import NotifySubscribersButton from "@/components/admin/NotifySubscribersButton";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true } },
    },
  });
  type AdminPost = (typeof posts)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h1>
          <p className="text-foreground/60">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
        >
          New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((post: AdminPost) => (
            <div
              key={post.id}
              className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 flex items-center justify-between hover:bg-foreground/10 transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-medium truncate">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-foreground/50 text-sm">/blog/{post.slug}</p>
                  <span className="text-foreground/40 text-xs">{post._count.comments} comments</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      post.published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-foreground/50 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                {post.published && <NotifySubscribersButton postId={post.id} />}
                <Link
                  href={`/admin/blog/${post.id}/comments`}
                  className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded text-sm transition"
                >
                  Comments ({post._count.comments})
                </Link>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded text-sm transition"
                >
                  Edit
                </Link>
                <TogglePostPublishedButton id={post.id} published={post.published} />
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">No blog posts yet</p>
          <Link
            href="/admin/blog/new"
            className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
          >
            Create First Post
          </Link>
        </div>
      )}
    </div>
  );
}
