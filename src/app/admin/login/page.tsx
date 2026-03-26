"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.ok) {
        setMessage("Check your email for a magic link to sign in!");
        setEmail("");
      } else {
        setError("Failed to send sign-in link. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin</h1>
          <p className="text-white/60">Sign in to manage your content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded font-medium transition"
          >
            {isLoading ? "Sending link..." : "Send Magic Link"}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          In development, magic links are logged to the console.
        </p>
      </div>
    </div>
  );
}
