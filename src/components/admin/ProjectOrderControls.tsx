"use client";

export default function ProjectOrderControls({
  id,
  order,
  canMoveUp,
  canMoveDown,
}: {
  id: string;
  order: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  async function updateOrder(nextOrder: number) {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: nextOrder }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating order");
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={!canMoveUp}
        onClick={() => updateOrder(order - 1)}
        className="px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded text-xs transition"
      >
        Up
      </button>
      <button
        type="button"
        disabled={!canMoveDown}
        onClick={() => updateOrder(order + 1)}
        className="px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded text-xs transition"
      >
        Down
      </button>
    </div>
  );
}
