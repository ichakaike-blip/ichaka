"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCommentButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete comment");
        setIsDeleting(false);
      }
    } catch {
      alert("Something went wrong");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-400 text-sm font-medium transition disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
