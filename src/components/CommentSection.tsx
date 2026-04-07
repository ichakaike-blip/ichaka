"use client";

import { useState } from "react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplySubmit: (parentCommentId: string, name: string, body: string) => Promise<void>;
  depth?: number;
}

function CommentItem({ comment, postId, onReplySubmit, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyName, setReplyName] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError("");
    setIsSubmitting(true);

    try {
      await onReplySubmit(comment.id, replyName, replyBody);
      setReplyName("");
      setReplyBody("");
      setShowReplyForm(false);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const marginLeft = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : "";

  return (
    <div className={`space-y-3 ${marginLeft}`}>
      <div className="card border-black/10 dark:border-white/10 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.name}</span>
            {depth > 0 && <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded">Reply</span>}
          </div>
          <span className="muted text-xs">
            {new Date(comment.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm leading-6 whitespace-pre-wrap">{comment.body}</p>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium mt-2"
        >
          {showReplyForm ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className={`card border-black/10 dark:border-white/10 p-4 space-y-3 ${marginLeft}`}>
          {replyError && <p className="text-red-500 text-sm">{replyError}</p>}
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-3 py-2 rounded border border-black/10 dark:border-white/20 bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reply</label>
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                required
                placeholder="Write your reply..."
                rows={3}
                className="w-full px-3 py-2 rounded border border-black/10 dark:border-white/20 bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500 text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded text-xs font-medium transition"
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </button>
          </form>
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`space-y-3 ${marginLeft}`}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplySubmit={onReplySubmit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  // Helper function to add a reply to a comment
  const addReplyToComment = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
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

      setComments((prev) => [...prev, { ...data, replies: [] }]);
      setName("");
      setBody("");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  const handleReplySubmit = async (parentCommentId: string, replyName: string, replyBody: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, parentCommentId, name: replyName, body: replyBody }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to post reply");
    }

    setComments((prev) => addReplyToComment(prev, parentCommentId, { ...data, replies: [] }));
  };

  // Count total comments including nested replies
  const countComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
  };

  const totalComments = countComments(comments);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">
        {totalComments > 0
          ? `${totalComments} Comment${totalComments === 1 ? "" : "s"}`
          : "Comments"}
      </h2>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySubmit={handleReplySubmit}
              depth={0}
            />
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
