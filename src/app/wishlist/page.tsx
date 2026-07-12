"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/lib/store";
import type { ParsedProduct } from "@/lib/types";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((s) => s.items);
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    fetch("/api/products")
      .then((res) => res.json())
      .then((all: ParsedProduct[]) => {
        setProducts(all.filter((p) => wishlistIds.includes(p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
        Loading wishlist…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="u-container py-24 sm:py-32">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-bone/10 bg-ink-soft">
            <Heart size={22} className="text-stone" />
          </div>
          <span className="eyebrow">Saved pieces</span>
          <h1 className="display-sub mt-3 text-bone">Your wishlist is empty</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-stone">
            Tap the heart on any product to save it here for later.
          </p>
          <Link href="/shop" className="btn-solid mt-8">Explore products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-10 sm:py-12">
          <span className="eyebrow">Saved pieces · {products.length}</span>
          <h1 className="display-sub mt-3 text-bone">Wishlist</h1>
        </div>
      </header>
      <div className="u-container py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
