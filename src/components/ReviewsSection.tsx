"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "./StarRating";
import SectionHeading from "./SectionHeading";

const reviews = [
  {
    quote:
      "The weight of the cotton is unreal. Feels like something twice the price, and the fit is spot on straight out of the box.",
    name: "Aarav K.",
    location: "Mumbai",
  },
  {
    quote:
      "Clean silhouettes, no loud branding. Exactly the kind of understated pieces I was looking for. Third order and counting.",
    name: "Rohan S.",
    location: "Bengaluru",
  },
  {
    quote:
      "Ordered the limited drop and the finishing details are next level. Delivery was quick and the packaging felt premium.",
    name: "Neil M.",
    location: "Delhi",
  },
];

export default function ReviewsSection() {
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="u-container">
        <SectionHeading
          index="07"
          eyebrow="Verified customers"
          title="Worn and trusted"
          copy="A rating of 4.8 across thousands of orders. Here's what a few of them said."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col rounded-[3px] border border-bone/10 bg-ink-soft p-7"
            >
              <Quote size={22} className="text-ember" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-bone/80">
                {review.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-bone/10 pt-5">
                <div>
                  <p className="text-sm font-semibold text-bone">{review.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                    {review.location}
                  </p>
                </div>
                <StarRating rating={5} size={13} showValue={false} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
