"use client";

export default function TogglePostPublishedButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  return (
    <button
      onClick={async () => {
        try {
          const response = await fetch(`/api/admin/blog/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: !published }),
          });

          if (response.ok) {
            window.location.reload();
          } else {
            alert("Failed to update publish status");
          }
        } catch (error) {
          console.error(error);
          alert("Error updating publish status");
        }
      }}
      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition"
    >
      {published ? "Unpublish" : "Publish"}
    </button>
  );
}
