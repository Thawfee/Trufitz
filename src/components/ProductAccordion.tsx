"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function ProductAccordion({
  items,
  defaultOpen = 0,
}: {
  items: { title: string; content: React.ReactNode }[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="border-t border-bone/10">
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-bone/10">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-bone">
              {item.title}
            </span>
            {open === i ? (
              <Minus size={16} className="text-stone" />
            ) : (
              <Plus size={16} className="text-stone" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-5 text-sm leading-relaxed text-stone">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
