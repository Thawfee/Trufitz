import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { RotateCcw, PackageCheck, CreditCard, ArrowLeftRight, Ban } from "lucide-react";

export const metadata = { title: "Returns & Refunds" };

const policies = [
  {
    icon: RotateCcw,
    title: "7-day returns",
    desc: "Return unworn, unwashed items with original tags within 7 days of delivery for a full refund.",
  },
  {
    icon: PackageCheck,
    title: "How to return",
    desc: "Go to Account → Orders, select your order, and request a return. We'll arrange a pickup within 2–3 business days.",
  },
  {
    icon: CreditCard,
    title: "Refund timeline",
    desc: "Refunds are processed within 5–7 business days after we receive and inspect the item, credited to your original payment method.",
  },
  {
    icon: ArrowLeftRight,
    title: "Size exchanges",
    desc: "Need a different size? Request an exchange within 7 days and we'll ship the new size free, subject to availability.",
  },
  {
    icon: Ban,
    title: "Non-returnable",
    desc: "Items marked 'Final Sale' and limited-edition drops aren't eligible for return unless they arrive defective.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <PageHeader
        index="Support"
        eyebrow="Easy & transparent"
        title="Returns & refunds"
        copy="An exchange experience as considered as the purchase. Here's exactly how it works."
      />
      <div className="u-container py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-3">
            {policies.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-[3px] border border-bone/10 bg-ink-soft p-6">
                <item.icon size={20} className="mt-0.5 shrink-0 text-ember" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[3px] border border-bone/10 bg-ink-soft p-6 text-center">
            <p className="text-sm text-stone">Still have a question about a return?</p>
            <Link href="/contact" className="btn-outline mt-4">Contact support</Link>
          </div>
        </div>
      </div>
    </>
  );
}
