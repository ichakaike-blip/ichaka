"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/reveal";

type SubmissionPayload = {
  name: string;
  bio: string;
  avatarUrl: string;
  twitter: string;
  linkedin: string;
  substack: string;
  website: string;
  postTitle: string;
  postExcerpt: string;
  coverImage: string;
  postContent: string;
};

const initialForm: SubmissionPayload = {
  name: "",
  bio: "",
  avatarUrl: "",
  twitter: "",
  linkedin: "",
  substack: "",
  website: "",
  postTitle: "",
  postExcerpt: "",
  coverImage: "",
  postContent: "",
};

export default function SubmitPage() {
  const [form, setForm] = useState<SubmissionPayload>(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function onChange<K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(typeof data?.error === "string" ? data.error : "Failed to submit post");
        return;
      }

      setSubmitted(true);
    } catch (submitError) {
      console.error("Submission error:", submitError);
      setError("Failed to submit post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <Reveal>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold md:text-4xl">Write for ichaka</h1>
          <p className="text-foreground/70">
            Share your perspective. Submit your post and we will review it for publication.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="card border-black/10 dark:border-white/10 p-8 rounded-xl">
          {submitted ? (
            <p className="text-foreground/70 text-center py-12">
              Your post has been submitted! We&apos;ll review it and get back to you.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-foreground/80">Name</label>
                <input id="name" required value={form.name} onChange={(e) => onChange("name", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm text-foreground/80">Bio</label>
                <textarea id="bio" rows={3} required placeholder="A short bio that will appear on your post" value={form.bio} onChange={(e) => onChange("bio", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="space-y-2">
                <label htmlFor="avatarUrl" className="text-sm text-foreground/80">Avatar image URL (optional)</label>
                <input id="avatarUrl" value={form.avatarUrl} onChange={(e) => onChange("avatarUrl", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm text-foreground/80">X (optional)</label>
                  <input id="twitter" placeholder="https://x.com/yourhandle" value={form.twitter} onChange={(e) => onChange("twitter", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm text-foreground/80">LinkedIn (optional)</label>
                  <input id="linkedin" value={form.linkedin} onChange={(e) => onChange("linkedin", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="substack" className="text-sm text-foreground/80">Substack (optional)</label>
                  <input id="substack" value={form.substack} onChange={(e) => onChange("substack", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm text-foreground/80">Website (optional)</label>
                  <input id="website" value={form.website} onChange={(e) => onChange("website", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="postTitle" className="text-sm text-foreground/80">Post title</label>
                <input id="postTitle" required value={form.postTitle} onChange={(e) => onChange("postTitle", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="space-y-2">
                <label htmlFor="postExcerpt" className="text-sm text-foreground/80">Post excerpt</label>
                <textarea id="postExcerpt" rows={2} required value={form.postExcerpt} onChange={(e) => onChange("postExcerpt", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="space-y-2">
                <label htmlFor="coverImage" className="text-sm text-foreground/80">Cover image URL (optional)</label>
                <input id="coverImage" value={form.coverImage} onChange={(e) => onChange("coverImage", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
              </div>

              <div className="space-y-1">
                <label htmlFor="postContent" className="text-sm text-foreground/80">Post content (Markdown supported)</label>
                <textarea id="postContent" rows={12} required value={form.postContent} onChange={(e) => onChange("postContent", e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 outline-none focus:border-cyan-400" />
                <p className="text-xs text-foreground/50">Tip: embed images with ![alt](url) · embed video with a bare .mp4 or YouTube URL on its own line</p>
              </div>

              <p className="text-xs text-foreground/60 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2">
                Disclaimer: As the blog owner, I may edit your submission for formatting and clarity without changing your intended message.
              </p>

              {error ? <p className="text-red-400 text-sm">{error}</p> : null}

              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-orange-500 py-3 font-medium text-foreground transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? "Submitting..." : "Submit for Review"}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}