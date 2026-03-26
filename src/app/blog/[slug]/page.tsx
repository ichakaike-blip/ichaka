import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";

marked.setOptions({
  breaks: true,
  gfm: true,
});

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) {
    return {
      title: "Post not found | ichaka",
    };
  }

  return {
    title: `${post.title} | ichaka`,
    description: post.excerpt ?? "Blog post by ichaka.",
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "Blog post by ichaka.",
      images: [`/api/og?title=${encodeURIComponent(post.title)}`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const htmlContent = marked.parse(post.content ?? "") as string;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold md:text-4xl">{post.title}</h1>
      {post.content ? (
        <div
          className="prose prose-lg max-w-none prose-p:mb-6 prose-p:leading-8 prose-headings:mt-8 prose-headings:mb-4 dark:prose-invert prose-p:text-gray-300 dark:prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p className="muted">No content yet.</p>
      )}
    </article>
  );
}
