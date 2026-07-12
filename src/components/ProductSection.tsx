"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import type { ParsedProduct } from "@/lib/types";

interface ProductSectionProps {
  title: string;
  products: ParsedProduct[];
  id?: string;
  index?: string;
  eyebrow?: string;
  viewAllHref?: string;
  subtitle?: string;
  tone?: "ink" | "bone";
  limit?: number;
}

export default function ProductSection({
  title,
  products,
  id,
  index,
  eyebrow = "Curated selection",
  viewAllHref,
  subtitle,
  tone = "ink",
  limit = 8,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="py-16 sm:py-24">
      <div className="u-container">
        {title && (
          <SectionHeading
            index={index}
            eyebrow={eyebrow}
            title={title}
            copy={subtitle}
            viewAllHref={viewAllHref}
            tone={tone}
          />
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, limit).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
