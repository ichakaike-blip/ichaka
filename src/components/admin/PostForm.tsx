"use client";

import { marked } from "marked";
import { useState } from "react";
import { useRouter } from "next/navigation";

type VideoToken = {
  mediaType?: "video" | "youtube";
  url?: string;
  videoId?: string;
};

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    content: string;
    published?: boolean;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const parseForPreview = (content: string) => {
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

    const withUnderline = content.replace(/\+\+([^+]+)\+\+/g, "<u>$1</u>");
    return marked.parse(withUnderline) as string;
  };

  const injectFormatting = (prefix: string, suffix = "") => {
    setFormData((prev) => {
      const template = `${prefix}${suffix}`;
      return {
        ...prev,
        content: prev.content ? `${prev.content}\n${template}` : template,
      };
    });
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    content: initialData?.content || "",
    published: initialData?.published ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if creating new post
    if (name === "title" && !initialData) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData
        ? `/api/admin/blog/${initialData.id}`
        : "/api/admin/blog";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save post");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter post title"
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          placeholder="post-url-slug"
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Excerpt (optional)
        </label>
        <input
          type="text"
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief summary of the post"
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="coverImage"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Cover Image URL
        </label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-foreground"
          >
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-orange-500 hover:text-orange-400"
          >
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>
        <p className="text-xs text-foreground/50 mb-2">
          Markdown supported: **bold**, _italic_, ++underline++, # Heading, ## Subheading, and blank lines for new sections.
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => injectFormatting("**bold text**")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => injectFormatting("_italic text_")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => injectFormatting("++underlined text++")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            Underline
          </button>
          <button
            type="button"
            onClick={() => injectFormatting("# Heading")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => injectFormatting("## Subheading")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => injectFormatting("", "\n")}
            className="rounded border border-foreground/20 bg-foreground/5 px-2 py-1 text-xs text-foreground/80 hover:bg-foreground/10"
          >
            New Section
          </button>
        </div>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Enter post content in Markdown..."
          rows={12}
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 font-mono text-sm"
        />
        <p className="text-foreground/40 text-xs mt-1">
          Tip: embed images with ![alt](url) · embed video with a bare .mp4 or YouTube URL on its own line
        </p>
      </div>

      <div className="flex items-center justify-between rounded border border-foreground/20 bg-foreground/5 px-3 py-2">
        <label htmlFor="published" className="text-sm font-medium text-foreground">
          Published
        </label>
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={formData.published}
          onChange={handlePublishedChange}
          className="h-4 w-4 rounded border-white/30 bg-transparent text-orange-500 focus:ring-orange-500"
        />
      </div>

      {showPreview && (
        <div className="p-4 bg-foreground/5 border border-foreground/20 rounded">
          <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>
          <div className="prose prose-lg max-w-none prose-p:mb-4 prose-p:leading-7 prose-headings:mt-6 prose-headings:mb-3 dark:prose-invert text-foreground/80">
            <div dangerouslySetInnerHTML={{ __html: parseForPreview(formData.content) }} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-foreground rounded font-medium transition"
        >
          {isLoading ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
