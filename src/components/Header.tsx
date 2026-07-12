"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/categories", label: "Collections" },
  { href: "/sale", label: "Sale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-bone/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="u-container">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="text-bone/80 transition-colors hover:text-bone lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <Link
              href="/"
              className="font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.02em] text-bone sm:text-2xl"
              aria-label="TRUFITZ home"
            >
              TRUFITZ
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                    active ? "text-bone" : "text-bone/55 hover:text-bone"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 h-px w-full bg-ember" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2.5 text-bone/75 transition-colors hover:text-bone"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/wishlist"
              className="relative hidden p-2.5 text-bone/75 transition-colors hover:text-bone sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-ember" />
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 text-bone/75 transition-colors hover:text-bone"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 font-mono text-[9px] font-semibold text-bone">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href={session ? "/account" : "/login"}
              className="p-2.5 text-bone/75 transition-colors hover:text-bone"
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSearch}
              className="overflow-hidden pb-4"
            >
              <div className="flex items-center gap-3 border-b border-bone/15 pb-2">
                <Search size={16} className="text-stone" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tees, shirts, essentials…"
                  className="w-full bg-transparent py-2 text-sm text-bone outline-none placeholder:text-stone/70"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={16} className="text-stone hover:text-bone" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink lg:hidden"
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-extrabold uppercase tracking-[0.02em]">
                  TRUFITZ
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-bone/80 hover:text-bone"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="mt-12 flex flex-1 flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-baseline gap-4 border-b border-bone/10 py-4"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="font-mono text-[11px] text-ember">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-3xl font-semibold uppercase tracking-tight">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="grid grid-cols-2 gap-3 pt-6">
                <Link href="/wishlist" className="btn-outline" onClick={() => setMobileOpen(false)}>
                  Wishlist
                </Link>
                <Link
                  href={session ? "/account" : "/login"}
                  className="btn-solid"
                  onClick={() => setMobileOpen(false)}
                >
                  {session ? "Account" : "Sign in"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
