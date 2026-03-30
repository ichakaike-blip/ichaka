"use client";

import { useState } from "react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, name, body }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Failed to post comment");
      return;
    }

    setComments((prev) => [...prev, data]);
    setName("");
    setBody("");
    setStatus("idle");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">
        {comments.length > 0 ? `${comments.length} Comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </h2>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card border-black/10 dark:border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{comment.name}</span>
                <span className="muted text-xs">
                  {new Date(comment.createdAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm leading-6 whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted text-sm">No comments yet. Be the first!</p>
      )}

      {/* Submit form */}
      <div className="card border-black/10 dark:border-white/10 p-6 space-y-4">
        <h3 className="font-medium">Leave a comment</h3>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-3 py-2 rounded border border-black/10 dark:border-white/20 bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Write your comment..."
              rows={4}
              className="w-full px-3 py-2 rounded border border-black/10 dark:border-white/20 bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded text-sm font-medium transition"
          >
            {status === "loading" ? "Posting..." : "Post comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
