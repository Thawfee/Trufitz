"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="bg-bone text-ink">
      <div className="u-container py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-ember" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
              09 — The list
            </span>
          </div>
          <h2 className="display-title text-ink text-balance">
            First access to every drop
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink/60">
            Join the list for early access to limited releases, restocks, and
            members-only pricing. No spam — just the good stuff.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-ink/15 bg-transparent px-5 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink/50"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-all duration-300 hover:bg-carbon"
            >
              {submitted ? (
                <>
                  <Check size={14} /> Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          <motion.p
            initial={false}
            animate={{ opacity: submitted ? 1 : 0 }}
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50"
          >
            Welcome to TRUFITZ — check your inbox.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
