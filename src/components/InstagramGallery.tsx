"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import SectionHeading from "./SectionHeading";

const galleryImages = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598033129183-a5123f29157b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
];

export default function InstagramGallery() {
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="u-container">
        <SectionHeading
          index="08"
          eyebrow="On the feed"
          title="@trufitz"
          copy="Tag us to be featured. See how the community styles the collection."
          viewAllHref="https://instagram.com"
          viewAllLabel="Follow"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((image, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-[3px] bg-carbon"
            >
              <Image
                src={resolveImageUrl(image)}
                alt={`TRUFITZ community look ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="img-editorial object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram size={20} className="text-bone" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
