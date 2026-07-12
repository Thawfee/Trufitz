"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Facebook, Twitter, Youtube, Check } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All products", href: "/shop" },
    { label: "New arrivals", href: "/new-arrivals" },
    { label: "Best sellers", href: "/best-sellers" },
    { label: "Limited edition", href: "/limited-edition" },
    { label: "Sale", href: "/sale" },
  ],
  Collections: [
    { label: "Oversized tees", href: "/categories/oversized-t-shirts" },
    { label: "T-shirts", href: "/categories/t-shirts" },
    { label: "Shirts", href: "/categories/shirts" },
    { label: "Pants", href: "/categories/pants" },
  ],
  Support: [
    { label: "Track order", href: "/track-order" },
    { label: "Returns & refunds", href: "/returns" },
    { label: "Contact us", href: "/contact" },
    { label: "About TRUFITZ", href: "/about" },
  ],
};

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <footer className="border-t border-bone/10 bg-ink text-bone">
      <div className="u-container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-extrabold uppercase tracking-[0.02em] text-bone"
            >
              TRUFITZ
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">
              Elevated men&apos;s streetwear — heavyweight essentials, sharp
              tailoring, and limited drops built to look better with age.
            </p>

            <form onSubmit={subscribe} className="mt-7 max-w-sm">
              <p className="eyebrow mb-2.5">Join the list</p>
              <div className="flex items-center gap-2 border-b border-bone/20 pb-1 focus-within:border-bone/50">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-transparent py-2 text-sm text-bone outline-none placeholder:text-stone/70"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70 transition-colors hover:text-bone"
                >
                  {done ? <Check size={14} className="text-ember" /> : "Subscribe →"}
                </button>
              </div>
            </form>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="eyebrow mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-stone transition-colors hover:border-bone/40 hover:text-bone"
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
            &copy; {new Date().getFullYear()} TRUFITZ · Crafted in India
          </p>
        </div>
      </div>
    </footer>
  );
}
