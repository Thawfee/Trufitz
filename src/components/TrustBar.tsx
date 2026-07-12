"use client";

import { motion } from "framer-motion";
import { Gem, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const items = [
  { icon: Gem, title: "Premium quality", copy: "Heavyweight fabrics, refined finishing" },
  { icon: ShieldCheck, title: "Secure checkout", copy: "Encrypted payments, protected data" },
  { icon: Truck, title: "Fast shipping", copy: "Tracked dispatch, premium packaging" },
  { icon: RotateCcw, title: "Easy returns", copy: "7-day exchanges, no fuss" },
  { icon: Headphones, title: "Here to help", copy: "Concierge support, any time" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-bone/10 bg-ink-soft">
      <div className="u-container">
        <div className="grid grid-cols-2 divide-bone/10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 px-2 py-6 sm:px-5 lg:px-6"
            >
              <item.icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="text-[13px] font-semibold tracking-tight text-bone">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-stone">{item.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
