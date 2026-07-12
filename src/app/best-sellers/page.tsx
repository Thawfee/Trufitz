import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";

export const metadata = { title: "Best Sellers" };

export default async function BestSellersPage() {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        index="03"
        eyebrow="Most wanted"
        title="Best sellers"
        copy="Proven fits in signature fabrics — the pieces our customers keep coming back for."
      />
      <div className="u-container py-10 sm:py-14">
        {products.length === 0 ? (
          <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
            Best sellers are on the way.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {parseProducts(products).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
