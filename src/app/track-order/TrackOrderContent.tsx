"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, Clock, Search } from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shipping: number;
  trackingNumber: string | null;
  createdAt: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: {
    quantity: number;
    size: string;
    price: number;
    product: { name: string; images: string };
  }[];
}

const statusSteps = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${num.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "We couldn't find that order. Check the number and try again.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const initial = searchParams.get("order");
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(orderNumber);
  };

  const currentStep = order ? statusSteps.findIndex((s) => s.key === order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-10 sm:py-12">
          <span className="eyebrow">Order status</span>
          <h1 className="display-sub mt-3 text-bone">Track your order</h1>
          <p className="mt-3 text-sm text-stone">
            Enter your order number to see the latest status and delivery details.
          </p>
        </div>
      </header>

      <div className="u-container py-10 sm:py-14">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. TF-XXXX-XXXX"
            className="field flex-1"
            aria-label="Order number"
          />
          <button type="submit" disabled={loading} className="btn-solid shrink-0 disabled:opacity-50">
            {loading ? "Checking…" : <><Search size={15} /> Track</>}
          </button>
        </form>

        {error && (
          <p className="mx-auto mt-6 max-w-xl rounded-[3px] border border-ember/30 bg-ember/10 px-4 py-3 text-center text-sm text-ember">
            {error}
          </p>
        )}

        {order && (
          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {/* Status */}
            <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">Order</p>
                  <p className="font-mono text-lg text-bone">{order.orderNumber}</p>
                </div>
                <span className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                  isCancelled ? "bg-ember/15 text-ember" : "bg-bone/10 text-bone"
                }`}>
                  {order.status}
                </span>
              </div>

              {!isCancelled ? (
                <div className="relative flex justify-between">
                  <div className="absolute left-0 right-0 top-4 h-px bg-bone/10" />
                  <div
                    className="absolute left-0 top-4 h-px bg-ember transition-all duration-700"
                    style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                  />
                  {statusSteps.map((step, i) => {
                    const done = i <= currentStep;
                    return (
                      <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          done ? "border-ember bg-ember text-bone" : "border-bone/20 bg-ink text-stone"
                        }`}>
                          <step.icon size={14} />
                        </div>
                        <span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${done ? "text-bone" : "text-stone"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-[3px] border border-ember/20 bg-ember/5 p-4">
                  <Clock size={18} className="text-ember" />
                  <p className="text-sm text-stone">This order was cancelled.</p>
                </div>
              )}

              {order.trackingNumber && (
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
                  Tracking: <span className="text-bone">{order.trackingNumber}</span>
                </p>
              )}
            </div>

            {/* Items */}
            <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-8">
              <h2 className="eyebrow mb-5">Items</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between gap-3 text-sm">
                    <span className="text-stone">
                      {item.product.name} <span className="text-stone/60">({item.size}) × {item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-mono text-bone">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-bone/10 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone">Subtotal</span>
                  <span className="font-mono text-bone">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Shipping</span>
                  <span className="font-mono text-bone">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-bone">Total</span>
                  <span className="font-mono text-bone">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:p-8">
              <h2 className="eyebrow mb-4">Delivery address</h2>
              <p className="text-sm leading-relaxed text-stone">
                {order.shippingName}
                <br />
                {order.shippingAddress}
                <br />
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
