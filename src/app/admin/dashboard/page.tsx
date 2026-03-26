import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const postCount = await prisma.blogPost.count();
  const projectCount = await prisma.project.count();
  const recentPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome to the admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-white/60 text-sm mb-2">Total Blog Posts</p>
          <p className="text-4xl font-bold text-white">{postCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-white/60 text-sm mb-2">Total Projects</p>
          <p className="text-4xl font-bold text-white">{projectCount}</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Blog Posts</h2>
        {recentPosts.length > 0 ? (
          <div className="space-y-2">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 border border-white/10 rounded p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{post.title}</p>
                  <p className="text-white/50 text-sm">
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
          <p className="text-white/60">No blog posts yet</p>
        )}
      </div>
    </div>
  );
}
