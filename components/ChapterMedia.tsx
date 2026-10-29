"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Media } from "@/content/site";

// A chapter's photos and clips. Cards tilt toward the pointer; videos play only while on screen.
export default function ChapterMedia({ items, layout = "grid" }: { items: Media[]; layout?: "grid" | "carousel" }) {
  if (layout === "carousel") return <Carousel items={items} />;
  return (
    <div className="media" data-count={items.length}>
      {items.map((item) => (
        <MediaCard key={item.src} item={item} />
      ))}
    </div>
  );
}

// An endless strip that drifts sideways. Hover to slow it, drag or flick to move it.
// Cards turn away slightly as they move off-centre, like a coverflow.
function Carousel({ items }: { items: Media[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const viewEl = viewRef.current;
    const trackEl = trackRef.current;
    if (!viewEl || !trackEl) return;
    const view: HTMLDivElement = viewEl;
    const track: HTMLDivElement = trackEl;
    const cards = Array.from(track.children) as HTMLElement[];
    const drift = reduce ? 0 : 40; // px per second
    let offset = 0;
    let speed = drift;
    let hovering = false;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let fling = 0;
    let moved = 0;
    let prev = performance.now();
    let raf = 0;

    const half = () => track.scrollWidth / 2;
    function wrap() {
      const h = half();
      if (h <= 0) return;
      offset = ((offset % h) + h) % h;
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      if (!dragging) {
        speed += ((hovering ? drift * 0.15 : drift) - speed) * 0.06;
        offset += speed * dt + fling * dt;
        fling *= 0.94;
      }
      wrap();
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      const mid = view.getBoundingClientRect();
      const centre = mid.left + mid.width / 2;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - centre) / (mid.width / 2)));
        card.style.setProperty("--cf-ry", `${(-d * 18).toFixed(2)}deg`);
        card.style.setProperty("--cf-s", (1 - Math.abs(d) * 0.08).toFixed(3));
        card.style.setProperty("--cf-o", (1 - Math.abs(d) * 0.35).toFixed(3));
      }
    }
    raf = requestAnimationFrame(frame);

    function down(e: PointerEvent) {
      dragging = true;
      moved = 0;
      fling = 0;
      lastX = e.clientX;
      lastT = performance.now();
      view.setPointerCapture(e.pointerId);
    }
    function move(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const now = performance.now();
      offset -= dx;
      moved += Math.abs(dx);
      fling = (-dx / Math.max(now - lastT, 1)) * 1000 * 0.6;
      lastX = e.clientX;
      lastT = now;
    }
    function up() {
      dragging = false;
    }
    // a drag shouldn't count as a click on a card
    function click(e: MouseEvent) {
      if (moved > 6) e.preventDefault();
    }
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    view.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerup", up);
    view.addEventListener("pointercancel", up);
    view.addEventListener("pointerenter", enter);
    view.addEventListener("pointerleave", leave);
    view.addEventListener("click", click, true);
    return () => {
      cancelAnimationFrame(raf);
      view.removeEventListener("pointerdown", down);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", up);
      view.removeEventListener("pointercancel", up);
      view.removeEventListener("pointerenter", enter);
      view.removeEventListener("pointerleave", leave);
      view.removeEventListener("click", click, true);
    };
  }, [reduce, items]);

  // The strip is rendered twice so it can loop without a gap; the copy is hidden from screen readers.
  return (
    <div ref={viewRef} className="carousel">
      <div ref={trackRef} className="carousel-track">
        {[...items, ...items].map((item, i) => (
          <MediaCard key={`${item.src}-${i}`} item={item} copy={i >= items.length} />
        ))}
      </div>
    </div>
  );
}

// A muted, looping clip that plays only while on screen, with a sound button when it has a soundtrack.
// Only one clip plays with sound at a time: turning one on mutes the rest.
export function LoopVideo({ item, copy = false }: { item: Media; copy?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item.sound) return;
    const onOther = (e: Event) => {
      if ((e as CustomEvent<HTMLVideoElement>).detail === video) return;
      video.muted = true;
      setSoundOn(false);
    };
    window.addEventListener("media-sound", onOther);
    return () => window.removeEventListener("media-sound", onOther);
  }, [item.sound]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const on = video.muted;
    video.muted = !on;
    setSoundOn(on);
    if (on) {
      window.dispatchEvent(new CustomEvent("media-sound", { detail: video }));
      video.play().catch(() => {});
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <>
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="none"
        controls={Boolean(reduce)}
        aria-label={item.alt}
      />
      {item.sound ? (
        <button type="button" className="mcard-sound" aria-pressed={soundOn} tabIndex={copy ? -1 : undefined} onClick={toggleSound}>
          {soundOn ? "Sound off" : "Sound on"}
        </button>
      ) : null}
    </>
  );
}

function MediaCard({ item, copy = false }: { item: Media; copy?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  function tilt(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || reduce || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }
  function reset() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }
  // Portrait photos are shown whole over a blurred copy of themselves, instead of being cropped.
  function checkShape(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth * 1.05) ref.current?.setAttribute("data-portrait", "true");
  }

  return (
    <figure
      ref={ref}
      className="mcard"
      data-kind={item.kind}
      aria-hidden={copy || undefined}
      onPointerMove={tilt}
      onPointerLeave={reset}
    >
      <div className="mcard-frame">
        {item.kind === "video" ? (
          <LoopVideo item={item} copy={copy} />
        ) : (
          <>
            <img className="mcard-backdrop" src={item.src} alt="" aria-hidden="true" loading="lazy" draggable={false} />
            <img className="mcard-img" src={item.src} alt={copy ? "" : item.alt} loading="lazy" draggable={false} onLoad={checkShape} />
          </>
        )}
      </div>
      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
    </figure>
  );
}
