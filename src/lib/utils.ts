import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountedPrice(price: number, discount: number): number {
  return Math.round(price - (price * discount) / 100);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TF-${timestamp}-${random}`;
}

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "text-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "text-blue-500" },
  { value: "processing", label: "Processing", color: "text-purple-500" },
  { value: "shipped", label: "Shipped", color: "text-indigo-500" },
  { value: "delivered", label: "Delivered", color: "text-green-500" },
  { value: "cancelled", label: "Cancelled", color: "text-red-500" },
] as const;

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
