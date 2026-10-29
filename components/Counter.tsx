"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

// Counts up to `value` the first time it scrolls into view. The server renders the
// final number, so the real figure is there without JavaScript and for search engines.
export default function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const armed = useRef(false);

  // Reset to zero only if the number is still off-screen, so nobody sees it jump.
  useEffect(() => {
    if (reduce || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true;
      setShown(0);
    }
  }, [reduce]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(0, value, { duration: 1.4, ease: [0.2, 0.7, 0.1, 1], onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {prefix}
        {format(shown)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
    </span>
  );
}
