"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
};

export default function SubmissionItemActions({ id }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();

  async function approve() {
    setLoading("approve");
    try {
      const response = await fetch(`/api/submissions/${id}/approve`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to approve");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to approve submission");
    } finally {
      setLoading(null);
    }
  }

  async function reject() {
    setLoading("reject");
    try {
      const response = await fetch(`/api/submissions/${id}/reject`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to reject");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to reject submission");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={approve}
          disabled={loading !== null}
          className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-orange-600 disabled:opacity-70"
        >
          {loading === "approve" ? "Approving..." : "Approve"}
        </button>
        <button
          type="button"
          onClick={reject}
          disabled={loading !== null}
          className="rounded bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30 disabled:opacity-70"
        >
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
