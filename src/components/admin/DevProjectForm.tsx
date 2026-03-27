"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DevProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    link: string;
    order: number;
    published: boolean;
  };
}

export default function DevProjectForm({ initialData }: DevProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    link: initialData?.link || "",
    order: String(initialData?.order ?? 0),
    published: initialData?.published ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
        ? `/api/admin/dev-projects/${initialData.id}`
        : "/api/admin/dev-projects";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save development project");
        return;
      }

      router.push("/admin/dev-projects");
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
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          required
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-foreground mb-2">
          Link
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-foreground mb-2">
          Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
        />
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

      <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-foreground rounded font-medium transition"
        >
          {isLoading ? "Saving..." : initialData ? "Update Development Project" : "Create Development Project"}
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
