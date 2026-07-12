import type { Product } from "@prisma/client";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  size: string;
  color?: string;
  quantity: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ParsedProduct extends Omit<Product, "images" | "sizes" | "colors"> {
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  category?: { name: string; slug: string };
}

export function parseProduct(
  product: Product & { category?: { name: string; slug: string } }
): ParsedProduct {
  let images: string[] = [];
  let sizes: string[] = ["S", "M", "L", "XL"];
  let colors: ProductColor[] = [];

  try {
    images = JSON.parse(product.images) as string[];
  } catch {
    images = [];
  }

  try {
    sizes = JSON.parse(product.sizes) as string[];
  } catch {
    sizes = ["S", "M", "L", "XL"];
  }

  try {
    colors = JSON.parse(product.colors || "[]") as ProductColor[];
  } catch {
    colors = [];
  }

  return {
    ...product,
    images,
    sizes,
    colors,
    rating: product.rating ?? 4.5,
    reviewCount: product.reviewCount ?? 0,
    fabric: product.fabric ?? "",
  };
}

export function parseProducts(
  products: (Product & { category?: { name: string; slug: string } })[]
): ParsedProduct[] {
  return products.map(parseProduct);
}
