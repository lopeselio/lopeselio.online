"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import type { Chapter } from "@/content/site";

type Split = Pick<Chapter, "id" | "split" | "when" | "gold">;

// Wraps the chapters (and the closing sections) and draws a speedrun-style split timer that follows the reader.
// Desktop: a fixed panel on the left. Small screens: a slim progress bar on top.
export default function Run({ splits, children }: { splits: Split[]; children: React.ReactNode }) {
  const runRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: runRef, offset: ["start center", "end center"] });

  useEffect(() => {
    const run = runRef.current;
    if (!run) return;

    const runObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      // Only once the story reaches the top of the screen, so the panel never covers the intro.
      rootMargin: "0px 0px -99% 0px",
    });
    runObserver.observe(run);

    // The current chapter is the last one whose top has crossed the middle of the screen.
    // Worked out from the scroll position, so it's right even after jumping past the chapters.
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let index = 0;
      splits.forEach((split, i) => {
        const el = document.getElementById(split.id);
        if (el && el.getBoundingClientRect().top <= middle) index = i;
      });
      setActive(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      runObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [splits]);

  const current = splits[active];

  return (
    <section ref={runRef} className="run" id="run" aria-label="My journey">
      <nav className="hud" aria-label="Chapters" data-visible={visible}>
        <p className="hud-label">
          Split {active + 1} of {splits.length}
        </p>
        <div className="hud-clock">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={current.when}
              initial={reduce ? false : { y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }}
            >
              {current.when}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="hud-current">{current.split}</span>
        <div className="hud-splits">
          <div className="hud-track" aria-hidden="true">
            <motion.div className="hud-fill" style={{ scaleY: scrollYProgress }} />
          </div>
          <ol className="splits">
            {splits.map((split, i) => (
              <li key={split.id} data-state={i < active ? "done" : i === active ? "current" : "next"}>
                <a href={`#${split.id}`} aria-current={i === active ? "step" : undefined}>
                  <span className="n">{i + 1}</span>
                  <span>{split.split}</span>
                  {split.gold ? <span className="gold" title="1st-place finish" /> : <span />}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <p className="hud-legend">
          <i aria-hidden="true" />
          1st-place finish
        </p>
      </nav>
      {children}
    </section>
  );
}
