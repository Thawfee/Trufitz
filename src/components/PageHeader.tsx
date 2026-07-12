import Link from "next/link";

export default function PageHeader({
  index,
  eyebrow,
  title,
  copy,
  breadcrumb,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  copy?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <header className="border-b border-bone/10">
      <div className="u-container py-12 sm:py-16">
        {breadcrumb && (
          <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
            <Link href="/" className="transition-colors hover:text-bone">
              Home
            </Link>
            {breadcrumb.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <span className="text-stone/50">/</span>
                <Link href={c.href} className="transition-colors hover:text-bone">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-ember" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
            {index ? `${index} — ` : ""}
            {eyebrow}
          </span>
        </div>
        <h1 className="display-title mt-4 text-bone">{title}</h1>
        {copy && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone">{copy}</p>
        )}
      </div>
    </header>
  );
}
