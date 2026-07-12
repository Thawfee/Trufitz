import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";

export const metadata = { title: "New Arrivals" };

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { section: "new-arrivals" },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Just landed"
        title="New arrivals"
        copy="The latest releases — fresh cuts in signature fabrics, added to the collection this season."
      />
      <div className="u-container py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {parseProducts(products).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
