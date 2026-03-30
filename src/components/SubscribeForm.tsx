"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="card border-black/10 dark:border-white/10 p-6">
      <h3 className="font-semibold text-lg mb-1">Get new posts in your inbox</h3>
      <p className="muted text-sm mb-4">No spam. Just new posts when they go live.</p>

      {status === "success" ? (
        <p className="text-green-500 text-sm font-medium">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 rounded border border-black/10 dark:border-white/20 bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded text-sm font-medium transition"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
