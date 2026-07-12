import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";

export const metadata = { title: "Limited Edition" };

export default async function LimitedEditionPage() {
  const products = await prisma.product.findMany({
    where: { isLimited: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        index="04"
        eyebrow="Limited drop · No restock"
        title="Limited edition"
        copy="Cut from heavyweight cotton and produced in a single short run. Once it's gone, it's gone."
      />
      <div className="u-container py-10 sm:py-14">
        {products.length === 0 ? (
          <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
            The next drop is coming soon — join the list to get early access.
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
