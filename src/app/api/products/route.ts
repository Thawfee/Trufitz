import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sale = searchParams.get("sale");
  const sort = searchParams.get("sort");
  const price = searchParams.get("price");
  const limit = searchParams.get("limit");

  const where: Prisma.ProductWhereInput = {};

  if (section === "new-arrivals") where.section = "new-arrivals";
  if (section === "best-sellers") where.isBestSeller = true;
  if (section === "trending") where.isTrending = true;
  if (section === "premium") where.isPremium = true;
  if (section === "limited") where.isLimited = true;
  if (sale === "true") where.isSale = true;

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (price === "0-1500") where.price = { lte: 1500 };
  if (price === "1500-2500") where.price = { gte: 1500, lte: 2500 };
  if (price === "2500+") where.price = { gte: 2500 };

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };
  if (sort === "discount") orderBy = { discount: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(parseProducts(products));
}

export async function POST(request: Request) {
  const body = await request.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      discount: body.discount || 0,
      images: JSON.stringify(body.images || []),
      colors: JSON.stringify(body.colors || []),
      sizes: JSON.stringify(body.sizes || ["S", "M", "L", "XL"]),
      fabric: body.fabric || "",
      stock: body.stock || 100,
      categoryId: body.categoryId,
      section: body.section || "new-arrivals",
      isPremium: body.isPremium || false,
      isLimited: body.isLimited || false,
      isSale: body.isSale || false,
      isTrending: body.isTrending || false,
      isBestSeller: body.isBestSeller || false,
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}
