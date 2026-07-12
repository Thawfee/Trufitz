import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.name ?? "Collection" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        index={`${products.length} pieces`}
        eyebrow="Collection"
        title={category.name}
        copy={`Refined ${category.name.toLowerCase()} designed to layer and last.`}
        breadcrumb={[{ label: "Collections", href: "/categories" }]}
      />

      <div className="u-container py-10 sm:py-14">
        {products.length === 0 ? (
          <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
            No products in this collection yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {parseProducts(products).map((product) => (
              <ProductCard key={product.id} product={{ ...product, category }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
