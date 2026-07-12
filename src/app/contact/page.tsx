"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Instagram, Twitter, Check } from "lucide-react";

const details = [
  { icon: Mail, label: "Email", value: "care@trufitz.com", href: "mailto:care@trufitz.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Studio", value: "Bandra West, Mumbai 400050", href: undefined },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 10am – 7pm IST", href: undefined },
];

const topics = ["Order help", "Sizing & fit", "Returns", "Wholesale", "Press", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Order help", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", topic: "Order help", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-12 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ember" />
            <span className="eyebrow">We&apos;re here to help</span>
          </div>
          <h1 className="display-title mt-4 text-bone">Get in touch</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone">
            Questions about an order, sizing, or a wholesale enquiry? Send us a note
            and our team will get back within one business day.
          </p>
        </div>
      </header>

      <div className="u-container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Details */}
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {details.map((d) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-[3px] border border-bone/10 bg-ink-soft p-5">
                    <d.icon size={18} className="mt-0.5 text-ember" strokeWidth={1.5} />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
                        {d.label}
                      </p>
                      <p className="mt-1 text-sm text-bone">{d.value}</p>
                    </div>
                  </div>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="transition-opacity hover:opacity-80">
                    {inner}
                  </a>
                ) : (
                  <div key={d.label}>{inner}</div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[3px] border border-bone/10 bg-ink-soft p-5">
              <p className="eyebrow mb-4">Follow along</p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-stone transition-colors hover:border-bone/40 hover:text-bone"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-[3px] border border-bone/10">
              <iframe
                title="TRUFITZ studio location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.815%2C19.045%2C72.845%2C19.075&layer=mapnik&marker=19.06%2C72.83"
                className="h-56 w-full grayscale"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-7 sm:p-9">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="eyebrow mb-2.5 block">Name</label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="eyebrow mb-2.5 block">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="field"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-topic" className="eyebrow mb-2.5 block">Topic</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, topic: t })}
                      className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                        form.topic === t
                          ? "border-bone bg-bone text-ink"
                          : "border-bone/20 text-stone hover:border-bone/50 hover:text-bone"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="c-message" className="eyebrow mb-2.5 block">Message</label>
                <textarea
                  id="c-message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="field resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button type="submit" className="btn-solid w-full sm:w-auto">
                {sent ? <><Check size={15} /> Message sent</> : "Send message"}
              </button>

              {sent && (
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ember">
                  Thanks — we&apos;ll be in touch within one business day.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
