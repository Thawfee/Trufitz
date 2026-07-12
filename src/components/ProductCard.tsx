"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Plus, Check } from "lucide-react";
import type { ParsedProduct } from "@/lib/types";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { getProductImage } from "@/lib/image";
import { StarRating, ColorSwatches } from "./StarRating";

export default function ProductCard({ product }: { product: ParsedProduct }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [hovered, setHovered] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const primaryImage = getProductImage(product.images, 0);
  const secondaryImage = getProductImage(product.images, 1);
  const displayImage = hovered && product.images.length > 1 ? secondaryImage : primaryImage;

  const addToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
      discount: product.discount,
      size: selectedSize,
      color: selectedColor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <>
      <div
        className="group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[3px] bg-carbon">
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="img-editorial object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
            </div>
          </Link>

          {/* Tags */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <span className="rounded-full bg-ember px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-bone">
                −{product.discount}%
              </span>
            )}
            {product.isLimited && (
              <span className="rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone backdrop-blur-sm">
                Limited
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => toggle(product.id)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/55 text-bone opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-ink/80 group-hover:opacity-100"
            aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart size={15} className={isWishlisted ? "fill-ember text-ember" : ""} />
          </button>

          {/* Quick actions */}
          <div className="absolute inset-x-2 bottom-2 hidden translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
            <button
              onClick={addToCart}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bone px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
            >
              {added ? <Check size={13} /> : <Plus size={13} />}
              {added ? "Added" : "Add"}
            </button>
            <button
              onClick={() => setQuickView(true)}
              className="rounded-full border border-bone/25 bg-ink/70 px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone backdrop-blur-sm transition-colors hover:bg-ink/90"
            >
              View
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/products/${product.slug}`} className="min-w-0">
              <h3 className="truncate text-[13px] font-medium tracking-tight text-bone transition-colors hover:text-stone sm:text-sm">
                {product.name}
              </h3>
            </Link>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[13px] text-bone sm:text-sm">
                {formatPrice(discountedPrice)}
              </p>
              {product.discount > 0 && (
                <p className="font-mono text-[10px] text-stone line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <StarRating rating={product.rating} size={11} />
            {product.colors && product.colors.length > 0 && (
              <ColorSwatches
                colors={product.colors.slice(0, 4)}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick view modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            onClick={() => setQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[4px] border border-bone/10 bg-ink-soft md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickView(false)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-bone hover:bg-ink"
                aria-label="Close quick view"
              >
                <X size={16} />
              </button>
              <div className="relative aspect-square md:aspect-auto">
                <Image src={primaryImage} alt={product.name} fill className="img-editorial object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <span className="eyebrow mb-3">{product.category?.name ?? "Quick view"}</span>
                <h3 className="display-sub mb-3 text-bone">{product.name}</h3>
                <div className="mb-4 flex items-center gap-3">
                  <StarRating rating={product.rating} size={13} />
                  <span className="font-mono text-[11px] text-stone">
                    {product.reviewCount} reviews
                  </span>
                </div>
                <div className="mb-5 flex items-baseline gap-2">
                  <span className="font-mono text-xl text-bone">{formatPrice(discountedPrice)}</span>
                  {product.discount > 0 && (
                    <span className="font-mono text-sm text-stone line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-stone">
                  {product.description}
                </p>
                <div className="mb-6">
                  <p className="eyebrow mb-2.5">Size — {selectedSize}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 w-10 rounded-[3px] border font-mono text-[11px] transition-colors ${
                          selectedSize === size
                            ? "border-bone bg-bone text-ink"
                            : "border-bone/20 text-bone hover:border-bone/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addToCart} className="btn-solid flex-1">
                    {added ? "Added" : "Add to cart"}
                  </button>
                  <button onClick={buyNow} className="btn-ember flex-1">
                    Buy now
                  </button>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-bone"
                  onClick={() => setQuickView(false)}
                >
                  Full details →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
