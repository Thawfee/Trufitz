"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const sizeData = [
  { size: "S", chest: "36–38", waist: "28–30", length: "27" },
  { size: "M", chest: "38–40", waist: "30–32", length: "28" },
  { size: "L", chest: "40–42", waist: "32–34", length: "29" },
  { size: "XL", chest: "42–44", waist: "34–36", length: "30" },
  { size: "XXL", chest: "44–46", waist: "36–38", length: "31" },
];

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="w-full max-w-lg rounded-[4px] border border-bone/10 bg-ink-soft p-7 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="eyebrow">Fit reference</span>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone"
                aria-label="Close size guide"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="display-sub mb-2 text-bone">Size guide</h3>
            <p className="mb-6 text-sm text-stone">
              Measurements in inches. For an oversized fit, size up one.
            </p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-bone/15 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                  <th className="pb-3 pr-4 font-normal">Size</th>
                  <th className="pb-3 pr-4 font-normal">Chest</th>
                  <th className="pb-3 pr-4 font-normal">Waist</th>
                  <th className="pb-3 font-normal">Length</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {sizeData.map((row) => (
                  <tr key={row.size} className="border-b border-bone/8">
                    <td className="py-3 pr-4 font-semibold text-bone">{row.size}</td>
                    <td className="py-3 pr-4 text-stone">{row.chest}&quot;</td>
                    <td className="py-3 pr-4 text-stone">{row.waist}&quot;</td>
                    <td className="py-3 text-stone">{row.length}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
