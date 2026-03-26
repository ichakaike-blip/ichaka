"use client";

export default function DeletePostButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
          const response = await fetch(`/api/admin/blog/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            window.location.reload();
          } else {
            alert("Failed to delete post");
          }
        } catch (error) {
          alert("Error deleting post");
          console.error(error);
        }
      }}
      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition"
    >
      Delete
    </button>
  );
}
