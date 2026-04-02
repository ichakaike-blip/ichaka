import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const postCount = await prisma.blogPost.count();
  const pendingSubmissionCount = await prisma.blogPost.count({ where: { status: "pending" } });
  const devCount = await prisma.devProject.count();
  const contentCount = await prisma.contentProject.count();
  const subscriberCount = await prisma.subscriber.count();
  const recentPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  type RecentPost = (typeof recentPosts)[number];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome to the admin panel</p>
        <div className="mt-4 flex items-center gap-3">
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-foreground rounded font-medium transition"
          >
            Add Blog Post
          </Link>
          <Link
            href="/admin/dev-projects/new"
            className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded font-medium transition"
          >
            Add Development Project
          </Link>
          <Link
            href="/admin/content-projects/new"
            className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded font-medium transition"
          >
            Add Content Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
          <p className="text-foreground/60 text-sm mb-2">Total Blog Posts</p>
          <p className="text-4xl font-bold text-foreground">{postCount}</p>
        </div>
        <Link href="/admin/submissions" className="block bg-foreground/5 border border-foreground/10 rounded-lg p-6 border-orange-500/20 hover:border-orange-500/50 transition">
          <p className="text-orange-500 text-sm mb-2 flex items-center justify-between">
            Pending Submissions <span>View &rarr;</span>
          </p>
          <p className="text-4xl font-bold text-orange-500">{pendingSubmissionCount}</p>
        </Link>
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
          <p className="text-foreground/60 text-sm mb-2">Development Projects</p>
          <p className="text-4xl font-bold text-foreground">{devCount}</p>
        </div>
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
          <p className="text-foreground/60 text-sm mb-2">Content Projects</p>
          <p className="text-4xl font-bold text-foreground">{contentCount}</p>
        </div>
        <Link href="/admin/subscribers" className="block bg-foreground/5 border border-foreground/10 rounded-lg p-6 border-orange-500/20 hover:border-orange-500/50 transition">
          <p className="text-orange-500 text-sm mb-2 flex items-center justify-between">
            Subscribers <span>View &rarr;</span>
          </p>
          <p className="text-4xl font-bold text-orange-500">{subscriberCount}</p>
        </Link>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Blog Posts</h2>
        {recentPosts.length > 0 ? (
          <div className="space-y-2">
            {recentPosts.map((post: RecentPost) => (
              <div
                key={post.id}
                className="bg-foreground/5 border border-foreground/10 rounded p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-foreground font-medium">{post.title}</p>
                  <p className="text-foreground/50 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    post.published
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">No blog posts yet</p>
        )}
      </div>
    </div>
  );
}
