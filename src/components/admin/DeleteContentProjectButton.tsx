"use client";

export default function DeleteContentProjectButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Are you sure you want to delete this content project?")) return;

        try {
          const response = await fetch(`/api/admin/content-projects/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            window.location.reload();
          } else {
            alert("Failed to delete content project");
          }
        } catch (error) {
          alert("Error deleting content project");
          console.error(error);
        }
      }}
      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition"
    >
      Delete
    </button>
  );
}
