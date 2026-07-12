"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();
  const shipping = total > 1999 ? 0 : 99;
  const freeShippingGap = Math.max(0, 1999 - total);
  const progress = Math.min(100, (total / 1999) * 100);

  if (items.length === 0) {
    return (
      <div className="u-container py-24 sm:py-32">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-bone/10 bg-ink-soft">
            <ShoppingBag size={22} className="text-stone" />
          </div>
          <span className="eyebrow">Your bag</span>
          <h1 className="display-sub mt-3 text-bone">Your cart is empty</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-stone">
            Nothing here yet. Explore the collection and add your next essential.
          </p>
          <Link href="/shop" className="btn-solid mt-8">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-10 sm:py-12">
          <span className="eyebrow">Your bag · {items.length} {items.length === 1 ? "item" : "items"}</span>
          <h1 className="display-sub mt-3 text-bone">Shopping cart</h1>
        </div>
      </header>

      <div className="u-container py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr] lg:gap-14">
          {/* Items */}
          <div>
            {/* Free shipping progress */}
            <div className="mb-8 rounded-[3px] border border-bone/10 bg-ink-soft p-5">
              <div className="mb-2 flex items-center gap-2 text-sm text-bone">
                <Truck size={15} className="text-ember" />
                {freeShippingGap > 0 ? (
                  <span>
                    Add <span className="font-semibold">{formatPrice(freeShippingGap)}</span> for free shipping
                  </span>
                ) : (
                  <span className="font-medium">You&apos;ve unlocked free shipping</span>
                )}
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-bone/10">
                <div className="h-full rounded-full bg-ember transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item) => {
                const price = getDiscountedPrice(item.price, item.discount);
                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 rounded-[3px] border border-bone/10 bg-ink-soft p-4 sm:gap-5 sm:p-5"
                  >
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-[3px] bg-carbon sm:h-36 sm:w-28">
                      <Image src={resolveImageUrl(item.image)} alt={item.name} fill className="img-editorial object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium text-bone">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="shrink-0 text-stone transition-colors hover:text-ember"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                          Size {item.size}
                          {item.color ? ` · ${item.color}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-bone/15">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="p-2 text-bone transition-colors hover:text-stone"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-2 text-bone transition-colors hover:text-stone"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="font-mono text-sm text-bone">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-stone transition-colors hover:text-bone"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="h-fit lg:sticky lg:top-24">
            <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-7">
              <h2 className="eyebrow mb-6">Order summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone">Subtotal</span>
                  <span className="font-mono text-bone">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Shipping</span>
                  <span className="font-mono text-bone">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-bone/10 pt-4">
                  <span className="font-semibold text-bone">Total</span>
                  <span className="font-mono text-lg text-bone">{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-solid mt-6 w-full">
                Checkout <ArrowRight size={15} />
              </Link>

              <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                <ShieldCheck size={13} className="text-ember" />
                Secure encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
