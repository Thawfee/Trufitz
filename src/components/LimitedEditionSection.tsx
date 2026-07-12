"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/image";

export default function LimitedEditionSection({ image }: { image: string }) {
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="u-container">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative min-h-[420px] overflow-hidden rounded-[3px] bg-carbon lg:min-h-[560px]"
          >
            <Image
              src={resolveImageUrl(image)}
              alt="TRUFITZ limited edition drop"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="img-editorial object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-bone/25 bg-ink/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone backdrop-blur-sm">
              Limited run · No restock
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-center rounded-[3px] border border-bone/10 bg-ink-soft p-8 sm:p-12"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-ember" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
                04 — Limited drop
              </span>
            </div>
            <h2 className="display-title text-bone">
              Made in small numbers
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-stone">
              Cut from heavyweight cotton and finished by hand, each limited drop
              is produced in a single short run. Once it&apos;s gone, it&apos;s gone —
              no restocks, no repeats.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "280 GSM heavyweight cotton",
                "Numbered, single production run",
                "Interior TRUFITZ care label",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-bone/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/limited-edition" className="btn-solid mt-9 w-fit">
              Explore the drop
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
