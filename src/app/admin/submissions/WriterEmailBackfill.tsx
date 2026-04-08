"use client";

import { useMemo, useState } from "react";

type WriterItem = {
  id: string;
  name: string;
  postCount: number;
  latestPostTitle: string;
};

type Props = {
  initialWriters: WriterItem[];
};

export default function WriterEmailBackfill({ initialWriters }: Props) {
  const [writers, setWriters] = useState<WriterItem[]>(initialWriters);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const remaining = useMemo(() => writers.length, [writers.length]);

  async function saveWriterEmail(writerId: string) {
    setError("");
    setSavingId(writerId);

    try {
      const email = (emails[writerId] || "").trim();

      const response = await fetch(`/api/admin/writers/${writerId}/email`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to update writer email");
      }

      setWriters((prev) => prev.filter((writer) => writer.id !== writerId));
      setEmails((prev) => {
        const next = { ...prev };
        delete next[writerId];
        return next;
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update writer email");
    } finally {
      setSavingId(null);
    }
  }

  if (initialWriters.length === 0 || remaining === 0) {
    return (
      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-foreground">Guest Writer Email Backfill</h2>
        <p className="text-sm text-foreground/60 mt-1">All guest writers already have an email on file.</p>
      </div>
    );
  }

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Guest Writer Email Backfill</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Add missing writer emails so they receive comment notifications on their posts.
        </p>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="space-y-3">
        {writers.map((writer) => (
          <div key={writer.id} className="border border-foreground/10 rounded-lg p-3 space-y-2">
            <div>
              <p className="text-sm font-medium text-foreground">{writer.name}</p>
              <p className="text-xs text-foreground/60">
                Posts: {writer.postCount} · Latest: {writer.latestPostTitle}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="email"
                value={emails[writer.id] || ""}
                onChange={(e) => setEmails((prev) => ({ ...prev, [writer.id]: e.target.value }))}
                placeholder="writer@example.com"
                className="w-full md:flex-1 rounded-lg border border-foreground/10 bg-background px-3 py-2 outline-none focus:border-cyan-400 text-sm"
              />
              <button
                type="button"
                onClick={() => saveWriterEmail(writer.id)}
                disabled={savingId === writer.id}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {savingId === writer.id ? "Saving..." : "Save email"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
