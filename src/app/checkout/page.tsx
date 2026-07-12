"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { CreditCard, Banknote, Smartphone, ShieldCheck, Lock } from "lucide-react";

type PaymentMethod = "razorpay" | "upi" | "cod";

const fields = [
  ["name", "Full name", "sm:col-span-2"],
  ["phone", "Phone number", "sm:col-span-1"],
  ["pincode", "Pincode", "sm:col-span-1"],
  ["address", "Address", "sm:col-span-2"],
  ["city", "City", "sm:col-span-1"],
  ["state", "State", "sm:col-span-1"],
] as const;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  const subtotal = getTotal();
  const shippingCost = subtotal > 1999 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (status === "loading") {
    return (
      <div className="py-24 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="u-container py-24 sm:py-32">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-bone/10 bg-ink-soft">
            <Lock size={20} className="text-stone" />
          </div>
          <span className="eyebrow">Secure checkout</span>
          <h1 className="display-sub mt-3 text-bone">Sign in to continue</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-stone">
            Sign in to complete your order and keep track of it end to end.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login" className="btn-solid">Sign in</Link>
            <Link href="/register" className="btn-outline">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="u-container py-24 text-center">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
          Your cart is empty
        </p>
        <Link href="/shop" className="btn-solid">Start shopping</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let razorpayOrderId: string | undefined;

    try {
      if (paymentMethod === "razorpay" || paymentMethod === "upi") {
        const paymentRes = await fetch("/api/payment/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        const paymentData = await paymentRes.json();
        razorpayOrderId = paymentData.orderId;
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          subtotal,
          shipping: shippingCost,
          total,
          razorpayOrderId,
          shippingName: shipping.name,
          shippingPhone: shipping.phone,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingPincode: shipping.pincode,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: getDiscountedPrice(item.price, item.discount),
          })),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "We couldn't place your order. Please try again.");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/track-order?order=${orderData.orderNumber}`);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: "razorpay" as const, label: "Card / Net banking", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
    { id: "upi" as const, label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
    { id: "cod" as const, label: "Cash on delivery", icon: Banknote, desc: "Pay when it arrives" },
  ];

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-10 sm:py-12">
          <span className="eyebrow">Secure checkout</span>
          <h1 className="display-sub mt-3 text-bone">Complete your order</h1>
        </div>
      </header>

      <div className="u-container py-10 sm:py-14">
        <form onSubmit={handleCheckout} className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:gap-14">
          <div className="space-y-8">
            {/* Shipping */}
            <section className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-7">
              <h2 className="eyebrow mb-5">Shipping details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map(([field, label, span]) => (
                  <div key={field} className={span}>
                    <label htmlFor={`f-${field}`} className="sr-only">{label}</label>
                    <input
                      id={`f-${field}`}
                      type={field === "phone" ? "tel" : "text"}
                      placeholder={label}
                      required
                      value={shipping[field]}
                      onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                      className="field"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-7">
              <h2 className="eyebrow mb-5">Payment method</h2>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex w-full items-center gap-4 rounded-[3px] border p-4 text-left transition-colors ${
                      paymentMethod === option.id
                        ? "border-bone bg-bone/[0.04]"
                        : "border-bone/12 hover:border-bone/40"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod === option.id ? "border-ember" : "border-bone/30"
                    }`}>
                      {paymentMethod === option.id && <span className="h-2.5 w-2.5 rounded-full bg-ember" />}
                    </span>
                    <option.icon size={18} className="text-stone" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-bone">{option.label}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Summary */}
          <div>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-7">
                <h2 className="eyebrow mb-5">Order summary</h2>
                <div className="mb-5 space-y-3">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex justify-between gap-3 text-sm">
                      <span className="text-stone">
                        {item.name} <span className="text-stone/60">({item.size}) × {item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-mono text-bone">
                        {formatPrice(getDiscountedPrice(item.price, item.discount) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-bone/10 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone">Subtotal</span>
                    <span className="font-mono text-bone">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">Shipping</span>
                    <span className="font-mono text-bone">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-semibold text-bone">Total</span>
                    <span className="font-mono text-lg text-bone">{formatPrice(total)}</span>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 rounded-[3px] border border-ember/30 bg-ember/10 px-3 py-2 text-sm text-ember">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-ember mt-6 w-full disabled:opacity-50">
                  {loading ? "Processing…" : `Place order · ${formatPrice(total)}`}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                  <ShieldCheck size={13} className="text-ember" />
                  256-bit encrypted payment
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
