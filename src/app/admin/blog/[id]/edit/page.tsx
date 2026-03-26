import PostForm from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Blog Post</h1>
        <p className="text-white/60">{post.title}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <PostForm
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? undefined,
            content: post.content,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
