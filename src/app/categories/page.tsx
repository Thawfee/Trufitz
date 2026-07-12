import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/image";

export const metadata = { title: "Collections" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <PageHeader
        index="Collections"
        eyebrow="Explore the wardrobe"
        title="Collections"
        copy="Four building blocks, each considered from fabric to finish. Choose your foundation."
      />

      <div className="u-container py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-[3px] bg-carbon"
            >
              <Image
                src={resolveImageUrl(category.image)}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="img-editorial object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-8">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/60">
                    {String(i + 1).padStart(2, "0")} / {category._count.products} pieces
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-bone sm:text-3xl">
                    {category.name}
                  </h3>
                </div>
                <span className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/70 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
