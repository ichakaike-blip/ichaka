import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Blog | ichaka",
  description: "Thoughts, notes, and writing from Ichaka.",
  openGraph: {
    title: "Blog | ichaka",
    description: "Thoughts, notes, and writing from Ichaka.",
    images: ["/api/og?title=Blog"],
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  type Post = (typeof posts)[number];

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Blog</h1>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal delay={0.05}>
          <div className="card border-black/10 dark:border-white/10">
            <p className="muted">
              No blog posts available yet.
            </p>
          </div>
        </Reveal>
      ) : null}

      <div className="grid gap-4">
        {posts.map((post: Post, index: number) => (
          <Reveal delay={0.08 + index * 0.04} key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="card block border-black/10 transition hover:border-cyan-400 dark:border-white/10"
            >
              <h2 className="text-xl font-medium">{post.title}</h2>
              {post.excerpt ? <p className="mt-2 muted">{post.excerpt}</p> : null}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
