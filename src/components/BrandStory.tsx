"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/image";

const stats = [
  { value: "220–280", label: "GSM cotton" },
  { value: "04", label: "Core categories" },
  { value: "7-day", label: "Easy returns" },
];

export default function BrandStory() {
  return (
    <section className="bg-bone text-ink">
      <div className="u-container py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-ember" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
                05 — Our philosophy
              </span>
            </div>
            <h2 className="display-title text-ink text-balance">
              Quiet luxury, built to last
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/65">
              TRUFITZ began with a simple frustration: streetwear that looked the
              part but fell apart. So we build the opposite — considered cuts,
              honest fabrics, and finishing you can feel. No loud logos, just
              garments that earn their place in your rotation.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/12 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-10 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-all duration-300 hover:bg-carbon"
            >
              Our story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-ink/5">
              <Image
                src={resolveImageUrl(
                  "https://images.unsplash.com/photo-1520975912210-595f7d2327fd?auto=format&fit=crop&w=900&q=80"
                )}
                alt="Detail of premium menswear fabric"
                fill
                sizes="(max-width: 1024px) 50vw, 26vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[3px] bg-ink/5">
              <Image
                src={resolveImageUrl(
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
                )}
                alt="Model wearing TRUFITZ essentials"
                fill
                sizes="(max-width: 1024px) 50vw, 26vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
