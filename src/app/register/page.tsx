"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fields = [
  { key: "name", label: "Full name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone (optional)", type: "tel" },
  { key: "password", label: "Password", type: "password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "We couldn't create your account. Please try again.");
      setLoading(false);
      return;
    }
    router.push("/login");
  };

  return (
    <div className="u-container py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <span className="eyebrow">Join TRUFITZ</span>
          <h1 className="display-sub mt-3 text-bone">Create account</h1>
          <p className="mt-3 text-sm text-stone">Faster checkout, order tracking, and early access to drops.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <p className="rounded-[3px] border border-ember/30 bg-ember/10 px-3 py-2 text-center text-sm text-ember">
              {error}
            </p>
          )}
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="eyebrow mb-2.5 block">{f.label}</label>
              <input
                id={f.key}
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                required={f.key !== "phone"}
                className="field"
              />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-solid w-full disabled:opacity-50">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone">
          Already have an account?{" "}
          <Link href="/login" className="text-bone underline-offset-4 transition-colors hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
