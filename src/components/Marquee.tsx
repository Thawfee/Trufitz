"use client";

const DEFAULT_ITEMS = [
  "Free shipping over ₹1,999",
  "Limited drops · Small runs",
  "Heavyweight cotton · 220–280 GSM",
  "7-day easy returns",
  "Crafted for the long wear",
  "Secure checkout",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  tone = "ember",
  fast = false,
}: {
  items?: string[];
  tone?: "ember" | "ink" | "bone";
  fast?: boolean;
}) {
  const toneClass =
    tone === "ember"
      ? "bg-[var(--color-ember)] text-[var(--color-bone)] border-y border-black/10"
      : tone === "bone"
      ? "bg-bone text-ink border-y border-black/10"
      : "bg-ink text-bone border-y border-bone/10";

  // Duplicate the list so the -50% loop is seamless.
  const loop = [...items, ...items];

  return (
    <div className={`overflow-hidden ${toneClass}`} aria-hidden="true">
      <div className={`marquee ${fast ? "marquee-fast" : ""} py-2.5`}>
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 whitespace-nowrap px-6 font-mono text-[11px] uppercase tracking-[0.22em]"
          >
            {item}
            <span className="opacity-50">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
