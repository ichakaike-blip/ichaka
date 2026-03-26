"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    published?: boolean;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
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
          className="block text-sm font-medium text-white mb-2"
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
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-white mb-2"
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
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-white mb-2"
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
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-white"
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
        <p className="text-xs text-white/50 mb-2">
          Markdown supported: **bold**, _italic_, # H1, ## H2, etc.
        </p>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Enter post content in Markdown..."
          rows={12}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500 font-mono text-sm"
        />
      </div>

      <div className="flex items-center justify-between rounded border border-white/20 bg-white/5 px-3 py-2">
        <label htmlFor="published" className="text-sm font-medium text-white">
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
        <div className="p-4 bg-white/5 border border-white/20 rounded">
          <h3 className="text-sm font-medium text-white mb-3">Preview</h3>
          <div className="prose prose-lg max-w-none prose-p:mb-4 prose-p:leading-7 prose-headings:mt-6 prose-headings:mb-3 dark:prose-invert text-white/80">
            {/* Basic markdown preview */}
            {formData.content.split("\n").map((line, i) => {
              if (line.startsWith("# "))
                return (
                  <h1 key={i} className="text-2xl font-bold mt-4 mb-2">
                    {line.replace("# ", "")}
                  </h1>
                );
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="text-xl font-bold mt-3 mb-2">
                    {line.replace("## ", "")}
                  </h2>
                );
              if (line.trim())
                return (
                  <p key={i} className="mb-3">
                    {line}
                  </p>
                );
              return <br key={i} />;
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded font-medium transition"
        >
          {isLoading ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
