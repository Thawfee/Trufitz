"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-72px)] items-end overflow-hidden">
      <Image
        src={resolveImageUrl(HERO_IMAGE)}
        alt="TRUFITZ seasonal editorial — heavyweight menswear on a studio set"
        fill
        priority
        sizes="100vw"
        className="img-editorial object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      {/* Top meta line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute inset-x-0 top-6 hidden sm:block"
      >
        <div className="u-container flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            Seasonal Edit — SS/26
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            N°01 / The Drop
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 u-container pb-14 pt-24 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-ember" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone/75">
            Luxury Streetwear for Men
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          className="display-hero max-w-[15ch] text-bone text-balance"
        >
          Dressed for the
          <span className="text-stone"> long wear.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="lede mt-6 text-bone/70"
        >
          Heavyweight essentials, sharp tailoring, and limited drops — built from
          premium fabrics and made to look better with every year.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/shop" className="btn-solid w-full sm:w-auto">
            Shop the collection
          </Link>
          <Link href="/new-arrivals" className="btn-outline w-full sm:w-auto">
            New arrivals
          </Link>
        </motion.div>
      </div>

      <motion.a
        href="#new"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-bone/60 transition-colors hover:text-bone lg:flex"
        aria-label="Scroll to collection"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ArrowDown size={14} />
        </motion.span>
      </motion.a>
    </section>
  );
}
