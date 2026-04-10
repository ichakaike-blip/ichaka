"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className="mx-auto max-w-xl py-16 text-center space-y-4">
      <h1 className="text-2xl font-semibold">This page could not load right now</h1>
      <p className="text-foreground/70">
        Please try again in a moment. If this keeps happening, return to the home page and retry.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-zinc-950 hover:bg-orange-400"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
