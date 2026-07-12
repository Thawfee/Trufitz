"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("That email and password don't match. Please try again.");
      setLoading(false);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="u-container py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <span className="eyebrow">Welcome back</span>
          <h1 className="display-sub mt-3 text-bone">Sign in</h1>
          <p className="mt-3 text-sm text-stone">Access your orders, wishlist, and faster checkout.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <p className="rounded-[3px] border border-ember/30 bg-ember/10 px-3 py-2 text-center text-sm text-ember">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="eyebrow mb-2.5 block">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="field" placeholder="you@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow mb-2.5 block">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-solid w-full disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone">
          New here?{" "}
          <Link href="/register" className="text-bone underline-offset-4 transition-colors hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-8 rounded-[3px] border border-bone/10 bg-ink-soft p-4 font-mono text-[11px] text-stone">
          <p className="mb-2 uppercase tracking-[0.16em] text-bone/70">Demo accounts</p>
          <p>Admin — admin@trufitz.com / admin123</p>
          <p>Customer — user@trufitz.com / user123</p>
        </div>
      </div>
    </div>
  );
}
