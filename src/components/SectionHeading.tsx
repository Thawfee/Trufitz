"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  copy,
  viewAllHref,
  viewAllLabel = "View all",
  tone = "ink",
  align = "left",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  copy?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  tone?: "ink" | "bone";
  align?: "left" | "center";
}) {
  const titleColor = tone === "bone" ? "text-ink" : "text-bone";
  const copyColor = tone === "bone" ? "text-ink/55" : "text-stone";
  const eyebrowColor = tone === "bone" ? "text-ink/50" : "text-stone";
  const linkColor =
    tone === "bone"
      ? "text-ink/50 hover:text-ink"
      : "text-bone/55 hover:text-bone";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between ${
        align === "center" ? "text-center lg:flex-col lg:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <div
          className={`mb-4 flex items-center gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-ember" />
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.3em] ${eyebrowColor}`}
          >
            {index ? `${index} — ` : ""}
            {eyebrow}
          </span>
        </div>
        <h2 className={`display-title ${titleColor}`}>{title}</h2>
        {copy && (
          <p className={`mt-4 text-[15px] leading-relaxed ${copyColor} max-w-xl`}>
            {copy}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${linkColor}`}
        >
          {viewAllLabel}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </motion.div>
  );
}
