import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getSanityClient, hasSanityConfig } from "@/lib/sanity/client";
import { postsQuery, type Post } from "@/lib/sanity/queries";

export default async function BlogPage() {
  let posts: Post[] = [];

  if (hasSanityConfig) {
    posts = await getSanityClient().fetch<Post[]>(postsQuery);
  }

  return (
    <section className="space-y-8">
      <Reveal>
        <h1 className="text-3xl font-semibold md:text-4xl">Blog</h1>
      </Reveal>

      {!hasSanityConfig ? (
        <Reveal delay={0.05}>
          <div className="card border-black/10 dark:border-white/10">
            <p className="muted">
              Sanity is not connected yet. Add environment variables from .env.example and run the
              Studio setup in /studio.
            </p>
          </div>
        </Reveal>
      ) : null}

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Reveal delay={0.08 + index * 0.04} key={post._id}>
            <Link
              href={`/blog/${post.slug.current}`}
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
