import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import TrustBar from "@/components/TrustBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import BestSellersSection from "@/components/BestSellersSection";
import LimitedEditionSection from "@/components/LimitedEditionSection";
import BrandStory from "@/components/BrandStory";
import ReviewsSection from "@/components/ReviewsSection";
import InstagramGallery from "@/components/InstagramGallery";
import NewsletterSection from "@/components/NewsletterSection";
import { prisma } from "@/lib/prisma";
import { parseProducts } from "@/lib/types";

export default async function HomePage() {
  const [categories, newArrivals, bestSellers, premium, sale] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { section: "new-arrivals" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPremium: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isSale: true },
      orderBy: { discount: "desc" },
      take: 8,
    }),
  ]);

  return (
    <>
      <Hero />
      <Marquee tone="ember" />

      <div id="new">
        <ProductSection
          index="01"
          eyebrow="Just landed"
          title="New arrivals"
          subtitle="The latest additions to the collection — fresh cuts in signature fabrics."
          products={parseProducts(newArrivals)}
          viewAllHref="/new-arrivals"
        />
      </div>

      <CategoryGrid categories={categories} />

      <TrustBar />

      <BestSellersSection products={parseProducts(bestSellers)} />

      <LimitedEditionSection image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=85" />

      <BrandStory />

      <ProductSection
        index="06"
        eyebrow="The premium line"
        title="Premium collection"
        subtitle="Elevated essentials with the finest fabrics and considered detailing."
        products={parseProducts(premium)}
        viewAllHref="/shop"
      />

      <ReviewsSection />
      <InstagramGallery />
      <NewsletterSection />

      {sale.length > 0 && (
        <ProductSection
          index="10"
          eyebrow="Limited-time pricing"
          title="On sale"
          subtitle="Elevated pieces at curated pricing, for a limited window."
          products={parseProducts(sale)}
          viewAllHref="/sale"
        />
      )}
    </>
  );
}
