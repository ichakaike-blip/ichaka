"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/passcode-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: passcode }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Invalid passcode");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin</h1>
          <p className="text-foreground/60">Enter your passcode to manage your content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-foreground/5 border border-foreground/20 rounded-lg p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-foreground mb-2">
              Admin Passcode
            </label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              placeholder="Enter passcode"
              className="w-full px-3 py-2 bg-foreground/5 border border-foreground/20 rounded text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-foreground rounded font-medium transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-foreground/50 text-sm mt-6">
          Current admin code: 4321
        </p>
      </div>
    </div>
  );
}
