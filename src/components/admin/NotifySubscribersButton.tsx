"use client";

import { useState } from "react";

export default function NotifySubscribersButton({ postId }: { postId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleNotify = async () => {
    if (!confirm("Send this post to all subscribers?")) return;
    setStatus("loading");

    const res = await fetch("/api/admin/notify-subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();
    setStatus("done");
    alert(data.message || `Sent to ${data.sent} subscribers`);
  };

  return (
    <button
      onClick={handleNotify}
      disabled={status === "loading"}
      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-foreground/70 rounded text-sm transition disabled:opacity-50"
    >
      {status === "loading" ? "Sending..." : status === "done" ? "Sent ✓" : "Notify"}
    </button>
  );
}
