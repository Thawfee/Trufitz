"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ParsedProduct } from "@/lib/types";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/image";
import { useWishlistStore } from "@/lib/store";
import { StarRating } from "./StarRating";
import SectionHeading from "./SectionHeading";

export default function BestSellersSection({ products }: { products: ParsedProduct[] }) {
  const { toggle, has } = useWishlistStore();
  if (!products.length) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="u-container">
        <SectionHeading
          index="03"
          eyebrow="Best sellers"
          title="Most wanted"
          copy="The pieces customers keep coming back for — proven fits in signature fabrics."
          viewAllHref="/best-sellers"
        />

        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide sm:mx-0 sm:px-0">
          {products.slice(0, 8).map((product) => {
            const price = getDiscountedPrice(product.price, product.discount);
            const wishlisted = has(product.id);
            return (
              <motion.article
                key={product.id}
                whileHover={{ y: -4 }}
                className="w-[74vw] shrink-0 snap-start overflow-hidden rounded-[3px] border border-bone/10 bg-ink-soft sm:w-[320px]"
              >
                <Link href={`/products/${product.slug}`} className="relative block">
                  <div className="relative h-[360px] overflow-hidden bg-carbon">
                    <Image
                      src={getProductImage(product.images, 0)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 74vw, 320px"
                      className="img-editorial object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  </div>
                </Link>
                <button
                  onClick={() => toggle(product.id)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-bone backdrop-blur-sm transition-colors hover:bg-ink/85"
                  aria-label="Save to wishlist"
                >
                  <Heart size={15} className={wishlisted ? "fill-ember text-ember" : ""} />
                </button>

                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium tracking-tight text-bone">
                      {product.name}
                    </h3>
                    <span className="shrink-0 font-mono text-sm text-bone">
                      {formatPrice(price)}
                    </span>
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <StarRating rating={product.rating} size={12} />
                    <span className="font-mono text-[10px] text-stone">
                      {product.reviewCount} reviews
                    </span>
                  </div>
                  <Link href={`/products/${product.slug}`} className="btn-outline w-full">
                    View product
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
