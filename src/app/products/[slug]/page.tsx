import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseProduct } from "@/lib/types";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { category: true },
  });

  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <ProductDetail
      product={{ ...parseProduct(product), category: product.category }}
      reviews={reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      related={related.map(parseProduct)}
    />
  );
}
