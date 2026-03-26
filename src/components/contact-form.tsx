"use client";

import { useState } from "react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 border-black/10 dark:border-white/10">
      <input
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
        placeholder="Name"
        name="name"
        required
      />
      <input
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
        placeholder="Email"
        name="email"
        type="email"
        required
      />
      <textarea
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-zinc-900"
        placeholder="Your message"
        name="message"
        rows={6}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
      {status === "success" ? <p className="text-sm text-green-400">Message sent successfully.</p> : null}
      {status === "error" ? <p className="text-sm text-red-400">Failed to send message. Please try again.</p> : null}
    </form>
  );
}
