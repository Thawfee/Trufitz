"use client";

import { Star } from "lucide-react";
import type { ParsedProduct } from "@/lib/types";

export function StarRating({
  rating = 0,
  size = 12,
  showValue = true,
}: {
  rating?: number;
  size?: number;
  showValue?: boolean;
}) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${safeRating.toFixed(1)} of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(safeRating)
              ? "fill-ember text-ember"
              : "fill-bone/12 text-bone/12"
          }
        />
      ))}
      {showValue && (
        <span className="ml-1.5 font-mono text-[10px] text-stone">
          {safeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function ColorSwatches({
  colors = [],
  selected,
  onSelect,
  size = "sm",
}: {
  colors?: ParsedProduct["colors"];
  selected?: string;
  onSelect?: (color: string) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-6 w-6";

  if (!colors.length) return null;

  return (
    <div className="flex gap-1.5">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onSelect?.(color.name)}
          title={color.name}
          aria-label={color.name}
          className={`${dim} rounded-full border transition-all ${
            selected === color.name
              ? "border-bone ring-1 ring-bone/40"
              : "border-bone/25 hover:border-bone/60"
          }`}
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </div>
  );
}
