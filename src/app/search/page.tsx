"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { ParsedProduct } from "@/lib/types";
import { Search as SearchIcon } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (!q) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ search: q, sort });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, sort]);

  return (
    <>
      <header className="border-b border-bone/10">
        <div className="u-container py-10 sm:py-12">
          <span className="eyebrow">Search</span>
          <h1 className="display-sub mt-3 text-bone">
            {q ? <>Results for &ldquo;{q}&rdquo;</> : "Search the collection"}
          </h1>
          {q && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
              {loading ? "Searching…" : `${products.length} ${products.length === 1 ? "result" : "results"}`}
            </p>
          )}
        </div>
      </header>

      <div className="u-container py-10 sm:py-14">
        {!q ? (
          <div className="py-16 text-center">
            <SearchIcon size={28} className="mx-auto text-stone/50" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-stone">Enter a term above to find products.</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-8 flex justify-end">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-[3px] border border-bone/15 bg-ink-soft px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-bone outline-none"
              >
                <option value="newest" className="bg-ink">Newest</option>
                <option value="price-low" className="bg-ink">Price: low to high</option>
                <option value="price-high" className="bg-ink">Price: high to low</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : !loading ? (
          <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
            No products found — try a different search.
          </p>
        ) : null}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
