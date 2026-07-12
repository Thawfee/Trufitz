import Image from "next/image";
import Link from "next/link";
import { Scissors, Leaf, Award, Recycle } from "lucide-react";
import Marquee from "@/components/Marquee";
import { resolveImageUrl } from "@/lib/image";

export const metadata = {
  title: "About",
  description:
    "The TRUFITZ story — considered cuts, honest fabrics, and finishing you can feel. Quiet luxury menswear built to last.",
};

const values = [
  {
    icon: Scissors,
    title: "Considered construction",
    copy: "Every seam, hem, and collar is engineered for how the garment actually wears — not just how it photographs.",
  },
  {
    icon: Leaf,
    title: "Honest materials",
    copy: "Heavyweight cotton, pre-shrunk and colour-fast. Fabrics chosen for the hand-feel and the long haul.",
  },
  {
    icon: Award,
    title: "Quality over volume",
    copy: "We release small runs and refine relentlessly. Fewer, better pieces you'll reach for on repeat.",
  },
  {
    icon: Recycle,
    title: "Built to last",
    copy: "Durable by design. The opposite of throwaway — garments that look better with every year of wear.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src={resolveImageUrl(
            "https://images.unsplash.com/photo-1520975912210-595f7d2327fd?auto=format&fit=crop&w=2000&q=85"
          )}
          alt="TRUFITZ atelier — considered menswear in a studio setting"
          fill
          priority
          sizes="100vw"
          className="img-editorial object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative z-10 u-container pb-14 pt-28">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-ember" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone/75">
              Our story
            </span>
          </div>
          <h1 className="display-hero max-w-[16ch] text-bone text-balance">
            Quiet luxury, worn every day
          </h1>
        </div>
      </section>

      <Marquee tone="bone" />

      {/* Intro */}
      <section className="u-container py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className="eyebrow">Est. — Made in India</span>
            <h2 className="display-title mt-4 text-bone text-balance">
              It started with a frustration
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-stone">
            <p>
              TRUFITZ began with a simple frustration: streetwear that looked the
              part in the store but fell apart after a few washes. Thin fabric,
              lazy cuts, loud logos doing the talking. We wanted the opposite.
            </p>
            <p>
              So we set out to build a wardrobe of essentials worth keeping —
              heavyweight cotton, considered proportions, and finishing you can
              feel. No seasonal noise. No branding for its own sake. Just
              garments designed to look sharp on day one and better on day five
              hundred.
            </p>
            <p>
              Today, every piece we make is held to the same standard: would we
              wear it ourselves, on repeat, for years? If the answer isn&apos;t an
              easy yes, it doesn&apos;t ship.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="border-y border-bone/10">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[400px] lg:min-h-[560px]">
            <Image
              src={resolveImageUrl(
                "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=85"
              )}
              alt="Detail of fabric and craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="img-editorial object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-ink-soft p-10 sm:p-16">
            <span className="eyebrow">The craft</span>
            <h2 className="display-title mt-4 text-bone">
              Details you feel before you see
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone">
              Ribbed collars that hold their shape. Reinforced shoulder seams.
              Garment-dyed colour with depth. Interior care labels printed, never
              scratchy. The kind of details that don&apos;t shout — but you notice
              every time you put it on.
            </p>
            <Link href="/shop" className="btn-solid mt-9 w-fit">
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="u-container py-20 sm:py-28">
        <div className="mb-12 flex items-center gap-3">
          <span className="h-px w-8 bg-ember" />
          <span className="eyebrow">What we stand for</span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[3px] border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="bg-ink p-8">
              <v.icon size={22} className="text-ember" strokeWidth={1.5} />
              <h3 className="mt-5 text-base font-semibold uppercase tracking-tight text-bone">
                {v.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bone text-ink">
        <div className="u-container py-20 text-center sm:py-28">
          <h2 className="display-title mx-auto max-w-2xl text-ink text-balance">
            Built for the long wear
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink/60">
            Discover the pieces designed to earn a permanent place in your rotation.
          </p>
          <div className="mt-9 flex justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-all hover:bg-carbon"
            >
              Shop now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-all hover:border-ink/50"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
