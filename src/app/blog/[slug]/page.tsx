import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import CommentSection from "@/components/CommentSection";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";


marked.setOptions({
  breaks: true,
  gfm: true,
});

type VideoToken = {
  mediaType?: "video" | "youtube";
  url?: string;
  videoId?: string;
};

const videoExtension = {
  name: 'videoExtension',
  level: 'block' as const,
  start(src: string) { return src.match(/^https?:\/\//)?.index; },
  tokenizer(src: string) {
    const rule = /^(https?:\/\/[^\s]+?\.(?:mp4|webm|ogg))(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'videoExtension',
        raw: match[0],
        url: match[1],
        mediaType: 'video'
      };
    }
    
    const ytRule = /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:&[^\s]*)?)(?:\n|$)/;
    const ytMatch = ytRule.exec(src);
    if (ytMatch) {
      return {
        type: 'videoExtension',
        raw: ytMatch[0],
        url: ytMatch[1],
        videoId: ytMatch[2],
        mediaType: 'youtube'
      };
    }
    return undefined;
  },
  renderer(token: VideoToken) {
    if (token.mediaType === 'video') {
      return `<video controls class="rounded-lg w-full my-6" src="${token.url}"></video>`;
    } else if (token.mediaType === 'youtube') {
      return `<div class="relative w-full my-6" style="padding-top:56.25%"><iframe class="absolute inset-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/${token.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return '';
  }
};
marked.use({
  extensions: [videoExtension],
  renderer: {
    image({ href, text }: { href: string, text: string }) {
      return `<img class="rounded-lg w-full my-6 border border-foreground/10" alt="${text}" src="${href}" loading="lazy" />`;
    }
  }
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
    include: { writer: true },
  });

  if (!post || !post.published) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
  });

  const contentWithUnderline = (post.content ?? "").replace(
    /\+\+([^+]+)\+\+/g,
    "<u>$1</u>"
  );
  const htmlContent = marked.parse(contentWithUnderline) as string;
  const socials = (() => {
    if (!post.writer?.socials) return null;
    try {
      const parsed = JSON.parse(post.writer.socials) as {
        twitter?: string;
        linkedin?: string;
        substack?: string;
        website?: string;
      };
      return {
        twitter: parsed.twitter?.trim() || "",
        linkedin: parsed.linkedin?.trim() || "",
        substack: parsed.substack?.trim() || "",
        website: parsed.website?.trim() || "",
      };
    } catch {
      return null;
    }
  })();

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

      {post.writer ? (
        <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6 mt-12 flex gap-4 items-start">
          {post.writer.avatar ? (
            <img
              src={post.writer.avatar}
              alt={`${post.writer.name} avatar`}
              className="w-14 h-14 rounded-full object-cover shrink-0"
              loading="lazy"
            />
          ) : null}
          <div>
            <p className="font-semibold text-foreground">{post.writer.name}</p>
            <p className="text-foreground/60 text-sm mt-1">{post.writer.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {socials?.twitter ? (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 hover:bg-cyan-400/10 transition">X</a>
              ) : null}
              {socials?.linkedin ? (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 hover:bg-cyan-400/10 transition">LinkedIn</a>
              ) : null}
              {socials?.substack ? (
                <a href={socials.substack} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 hover:bg-cyan-400/10 transition">Substack</a>
              ) : null}
              {socials?.website ? (
                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-3 py-1 hover:bg-cyan-400/10 transition">Website</a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <Reveal delay={0.16}>
        <div className="pt-8 border-t border-black/10 dark:border-white/10 mt-12">
          <CommentSection
            postId={post.id}
            initialComments={comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        </div>
      </Reveal>
    </article>
  );
}
