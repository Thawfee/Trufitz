"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft, Ruler, Zap, Check, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import type { ParsedProduct } from "@/lib/types";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { getProductImage, normalizeImageArray } from "@/lib/image";
import { StarRating, ColorSwatches } from "./StarRating";
import ProductCard from "./ProductCard";
import ProductAccordion from "./ProductAccordion";
import SizeGuideModal from "./SizeGuideModal";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export default function ProductDetail({
  product,
  reviews,
  related,
}: {
  product: ParsedProduct & { category: { name: string; slug: string } };
  reviews: Review[];
  related: ParsedProduct[];
}) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const productImages = normalizeImageArray(product.images);
  const savings = product.price - discountedPrice;

  const addToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: getProductImage(productImages, 0),
      price: product.price,
      discount: product.discount,
      size: selectedSize,
      color: selectedColor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const accordionItems = [
    {
      title: "Description",
      content: <p>{product.description}</p>,
    },
    {
      title: "Fabric & fit",
      content: (
        <ul className="space-y-2">
          {product.fabric && (
            <li className="flex gap-2">
              <span className="text-ember">·</span> {product.fabric}
            </li>
          )}
          <li className="flex gap-2">
            <span className="text-ember">·</span> True to size — take your usual fit.
          </li>
          <li className="flex gap-2">
            <span className="text-ember">·</span> Pre-shrunk and colour-fast.
          </li>
        </ul>
      ),
    },
    {
      title: "Care instructions",
      content: (
        <ul className="space-y-2">
          <li className="flex gap-2"><span className="text-ember">·</span> Machine wash cold, inside out.</li>
          <li className="flex gap-2"><span className="text-ember">·</span> Do not bleach. Wash with similar colours.</li>
          <li className="flex gap-2"><span className="text-ember">·</span> Tumble dry low or hang to dry.</li>
          <li className="flex gap-2"><span className="text-ember">·</span> Warm iron if needed; avoid the print.</li>
        </ul>
      ),
    },
    {
      title: "Shipping & returns",
      content: (
        <ul className="space-y-2">
          <li className="flex gap-2"><span className="text-ember">·</span> Free shipping on orders over ₹1,999.</li>
          <li className="flex gap-2"><span className="text-ember">·</span> Dispatched in 24–48 hours, tracked end to end.</li>
          <li className="flex gap-2"><span className="text-ember">·</span> 7-day easy returns and size exchanges.</li>
        </ul>
      ),
    },
  ];

  return (
    <div>
      <div className="border-b border-bone/10">
        <div className="u-container py-5">
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
            <Link href="/" className="transition-colors hover:text-bone">Home</Link>
            <span className="text-stone/50">/</span>
            <Link href={`/categories/${product.category.slug}`} className="transition-colors hover:text-bone">
              {product.category.name}
            </Link>
            <span className="text-stone/50">/</span>
            <span className="truncate text-bone/80">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="u-container py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div
              className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[3px] bg-carbon"
              onMouseMove={handleZoom}
              onMouseLeave={() => setZoomPos(null)}
            >
              <Image
                src={getProductImage(productImages, selectedImage)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="img-editorial object-cover transition-transform duration-200"
                style={
                  zoomPos
                    ? {
                        transform: "scale(1.8)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-ember px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-bone">
                  −{product.discount}% off
                </span>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-24 w-20 overflow-hidden rounded-[3px] border transition-colors ${
                      selectedImage === i ? "border-bone" : "border-bone/15 hover:border-bone/40"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="img-editorial object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="eyebrow">{product.category.name}</span>
            <h1 className="display-sub mt-3 text-bone">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={product.rating} size={14} />
              <span className="font-mono text-[11px] text-stone">
                {product.reviewCount} reviews
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-3xl text-bone">{formatPrice(discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="font-mono text-lg text-stone line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-ember/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember">
                    Save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
              Inclusive of all taxes
            </p>

            <div className="my-8 h-px bg-bone/10" />

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-7">
                <p className="eyebrow mb-3">Colour — {selectedColor}</p>
                <ColorSwatches
                  colors={product.colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                  size="md"
                />
              </div>
            )}

            {/* Size */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Size — {selectedSize}</p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone transition-colors hover:text-bone"
                >
                  <Ruler size={12} /> Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 min-w-12 rounded-[3px] border px-3 font-mono text-[12px] transition-colors ${
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

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={addToCart} className="btn-solid flex-1">
                {added ? <><Check size={15} /> Added to cart</> : <><ShoppingBag size={15} /> Add to cart</>}
              </button>
              <button onClick={buyNow} className="btn-ember flex-1">
                <Zap size={15} /> Buy now
              </button>
              <button
                onClick={() => toggle(product.id)}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-bone/20 transition-colors hover:border-bone/50"
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart size={18} className={isWishlisted ? "fill-ember text-ember" : "text-bone"} />
              </button>
            </div>

            {product.stock <= 10 && product.stock > 0 && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ember">
                Low stock — only {product.stock} left
              </p>
            )}

            {/* Assurances */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free shipping over ₹1,999" },
                { icon: RotateCcw, label: "7-day easy returns" },
                { icon: ShieldCheck, label: "Secure checkout" },
              ].map((a) => (
                <div key={a.label} className="rounded-[3px] border border-bone/10 bg-ink-soft p-3 text-center">
                  <a.icon size={16} className="mx-auto text-ember" strokeWidth={1.5} />
                  <p className="mt-2 text-[10px] leading-tight text-stone">{a.label}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="mt-9">
              <ProductAccordion items={accordionItems} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-20 border-t border-bone/10 pt-14">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-ember" />
              <span className="eyebrow">Customer reviews</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-[3px] border border-bone/10 bg-ink-soft p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-bone">{review.user.name}</p>
                    <StarRating rating={review.rating} size={12} showValue={false} />
                  </div>
                  <p className="text-sm leading-relaxed text-stone">{review.comment}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-stone/60">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-bone/10 pt-14">
            <div className="mb-10 flex items-center gap-3">
              <span className="h-px w-8 bg-ember" />
              <span className="eyebrow">You may also like</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
