"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Chapter titles start condensed and widen as they scroll into place.
export default function WidenTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const width = useTransform(scrollYProgress, [0, 1], [75, 100]);
  const settings = useTransform(width, (w) => `"wdth" ${w.toFixed(1)}`);

  return (
    <motion.h2
      ref={ref}
      className={className}
      style={{ fontVariationSettings: reduce ? '"wdth" 100' : settings }}
    >
      {children}
    </motion.h2>
  );
}
