import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProduct } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(parseProduct(product));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      discount: body.discount,
      images: body.images ? JSON.stringify(body.images) : undefined,
      sizes: body.sizes ? JSON.stringify(body.sizes) : undefined,
      stock: body.stock,
      categoryId: body.categoryId,
      section: body.section,
      isPremium: body.isPremium,
      isLimited: body.isLimited,
      isSale: body.isSale,
      isTrending: body.isTrending,
      isBestSeller: body.isBestSeller,
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
