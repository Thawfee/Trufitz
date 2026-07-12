"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import type { ParsedProduct } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";

const categories = [
  { slug: "", label: "All" },
  { slug: "oversized-t-shirts", label: "Oversized tees" },
  { slug: "t-shirts", label: "T-shirts" },
  { slug: "shirts", label: "Shirts" },
  { slug: "pants", label: "Pants" },
];

const priceRanges = [
  { value: "all", label: "All prices" },
  { value: "0-1500", label: "Under ₹1,500" },
  { value: "1500-2500", label: "₹1,500 – ₹2,500" },
  { value: "2500+", label: "Above ₹2,500" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "discount", label: "Best discount" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (priceRange !== "all") params.set("price", priceRange);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, sort, priceRange]);

  const Filters = () => (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-4">Category</p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={`block w-full py-2 text-left text-sm transition-colors ${
                category === cat.slug ? "text-bone" : "text-stone hover:text-bone"
              }`}
            >
              <span className="flex items-center gap-2">
                {category === cat.slug && <span className="h-1 w-1 rounded-full bg-ember" />}
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-bone/10 pt-8">
        <p className="eyebrow mb-4">Price</p>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value)}
              className={`block w-full py-2 text-left text-sm transition-colors ${
                priceRange === range.value ? "text-bone" : "text-stone hover:text-bone"
              }`}
            >
              <span className="flex items-center gap-2">
                {priceRange === range.value && <span className="h-1 w-1 rounded-full bg-ember" />}
                {range.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        index="Shop"
        eyebrow="The full collection"
        title="Shop all"
        copy="Premium streetwear built around clean lines, elevated fabrics, and uncompromising comfort."
      />

      <div className="u-container py-10 sm:py-14">
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-bone/10 pb-5">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone lg:hidden"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-stone lg:block">
            {loading ? "Loading…" : `${products.length} pieces`}
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-stone sm:block">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-[3px] border border-bone/15 bg-ink-soft px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-bone outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-ink">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <Filters />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-[3px] bg-carbon" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
                  No pieces match these filters
                </p>
                <button
                  onClick={() => {
                    setCategory("");
                    setPriceRange("all");
                  }}
                  className="btn-outline mt-6"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-ink/70" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto border-r border-bone/10 bg-ink-soft p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="eyebrow">Filters</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={18} className="text-stone" />
              </button>
            </div>
            <Filters />
            <button onClick={() => setFiltersOpen(false)} className="btn-solid mt-10 w-full">
              Show {products.length} results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">Loading shop…</div>}>
      <ShopContent />
    </Suspense>
  );
}
