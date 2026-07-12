"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, ORDER_STATUSES } from "@/lib/utils";
import { MapPin, Package, Heart, RotateCcw, Shield, Plus, LogOut } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { quantity: number }[];
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"orders" | "addresses">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders").then((r) => r.json()).then(setOrders).catch(() => setOrders([]));
      fetch("/api/addresses").then((r) => r.json()).then(setAddresses).catch(() => setAddresses([]));
    }
  }, [session]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    if (res.ok) {
      const addr = await res.json();
      setAddresses([...addresses, addr]);
      setShowAddressForm(false);
      setAddressForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
    }
  };

  if (status === "loading") {
    return (
      <div className="py-24 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
        Loading…
      </div>
    );
  }
  if (!session) return null;

  const isAdmin = (session.user as { role?: string })?.role === "admin";

  const shortcuts = [
    { icon: Package, label: "Track order", href: "/track-order" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: RotateCcw, label: "Returns", href: "/returns" },
    ...(isAdmin ? [{ icon: Shield, label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container flex flex-col gap-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12">
          <div>
            <span className="eyebrow">Your account</span>
            <h1 className="display-sub mt-3 text-bone">My account</h1>
            <p className="mt-2 text-sm text-stone">
              {session.user?.name} · {session.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-bone/20 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone transition-colors hover:border-bone/50 hover:text-bone"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <div className="u-container py-10 sm:py-14">
        {/* Shortcuts */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[3px] border border-bone/10 bg-ink-soft p-6 text-center transition-colors hover:border-bone/30"
            >
              <item.icon size={20} className="mx-auto mb-3 text-ember" strokeWidth={1.5} />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-8 border-b border-bone/10">
          {(["orders", "addresses"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                tab === t ? "border-ember text-bone" : "border-transparent text-stone hover:text-bone"
              }`}
            >
              {t === "orders" ? "Order history" : "Saved addresses"}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" &&
          (orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={26} className="mx-auto text-stone/50" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-stone">No orders yet.</p>
              <Link href="/shop" className="btn-outline mt-6">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status);
                return (
                  <Link
                    key={order.id}
                    href={`/track-order?order=${order.orderNumber}`}
                    className="flex items-center justify-between rounded-[3px] border border-bone/10 bg-ink-soft p-5 transition-colors hover:border-bone/30"
                  >
                    <div>
                      <p className="font-mono text-sm text-bone">{order.orderNumber}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-bone">{formatPrice(order.total)}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember">
                        {statusInfo?.label || order.status}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}

        {/* Addresses */}
        {tab === "addresses" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
                {addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}
              </p>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white"
              >
                <Plus size={13} /> Add address
              </button>
            </div>

            {showAddressForm && (
              <form
                onSubmit={handleAddAddress}
                className="mb-6 grid gap-3 rounded-[3px] border border-bone/10 bg-ink-soft p-6 sm:grid-cols-2"
              >
                {(["name", "phone", "address", "city", "state", "pincode"] as const).map((field) => (
                  <input
                    key={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required
                    value={addressForm[field]}
                    onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                    className={`field ${field === "address" ? "sm:col-span-2" : ""}`}
                  />
                ))}
                <button type="submit" className="btn-solid sm:col-span-2 sm:w-fit">
                  Save address
                </button>
              </form>
            )}

            {addresses.length === 0 && !showAddressForm ? (
              <div className="py-16 text-center">
                <MapPin size={26} className="mx-auto text-stone/50" strokeWidth={1.5} />
                <p className="mt-4 text-sm text-stone">No saved addresses yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="rounded-[3px] border border-bone/10 bg-ink-soft p-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-ember" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-semibold text-bone">{addr.name}</p>
                        <p className="mt-1 text-sm text-stone">
                          {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-stone/70">{addr.phone}</p>
                        {addr.isDefault && (
                          <span className="mt-2 inline-block rounded-full bg-bone/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-bone">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
