import { notFound } from "next/navigation";
import { marked } from "marked";
import { getSanityClient, hasSanityConfig } from "@/lib/sanity/client";

marked.setOptions({
  breaks: true,
  gfm: true,
});

type Params = { slug: string };

type PostDetail = {
  title: string;
  content?: string;
};

const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  title,
  content
}`;

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  if (!hasSanityConfig) {
    notFound();
  }

  const { slug } = await params;
  const post = await getSanityClient().fetch<PostDetail | null>(postBySlugQuery, { slug });

  if (!post) {
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
