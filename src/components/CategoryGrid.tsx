"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { resolveImageUrl } from "@/lib/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

const fallbackImages: Record<string, string> = {
  "oversized-t-shirts":
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
  "t-shirts":
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  shirts:
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  pants:
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="u-container">
        <SectionHeading
          index="02"
          eyebrow="Shop by category"
          title="The wardrobe, sorted"
          copy="Four building blocks — refined tees, elevated shirting, and tailored bottoms designed to layer."
          viewAllHref="/categories"
          viewAllLabel="All collections"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category, i) => {
            const imageUrl = resolveImageUrl(
              category.image ||
                fallbackImages[category.slug] ||
                fallbackImages["t-shirts"]
            );
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[3px] bg-carbon"
                >
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="img-editorial object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold uppercase leading-none tracking-tight text-bone sm:text-lg">
                      {category.name}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70 transition-colors group-hover:text-bone">
                      Shop <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
