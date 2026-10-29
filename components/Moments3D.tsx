"use client";

import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import type { Media } from "@/content/site";

// Photos from outside work on a slowly turning ring. Drag (or swipe) to spin it;
// hovering a photo brings it forward and shows its caption.
export default function Moments3D({ items }: { items: Media[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop = () => {};
    let cancelled = false;
    import("three").then((THREE) => {
      if (cancelled || !hostRef.current || !canvasRef.current) return;
      stop = startRing(THREE, hostRef.current, canvasRef.current, items, setActive);
      setReady(true);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [items]);

  const current = items[active];

  return (
    <div ref={hostRef} className="moments-stage" data-ready={ready}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="moments-caption" aria-live="polite">
        {current?.caption}
      </p>
      <p className="moments-hint" aria-hidden="true">
        Drag to spin
      </p>
      {/* The same photos as a plain list, for screen readers and if WebGL is unavailable */}
      <ul className="moments-fallback">
        {items.map((item) => (
          <li key={item.src}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            {item.caption ? <span>{item.caption}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function startRing(
  THREE: typeof T,
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  items: Media[],
  onActive: (i: number) => void,
) {
  let renderer: T.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return () => {};
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const ring = new THREE.Group();
  scene.add(ring);

  const n = items.length;
  // wide enough that neighbouring photos (landscape ones included) don't overlap
  const R = Math.max(5.2, n * 1.08);
  const H = 3.4;
  const loader = new THREE.TextureLoader();
  const cards = items.map((item, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.scale.set(H * 0.8, H, 1);
    loader.load(item.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      mat.map = tex;
      mat.needsUpdate = true;
      const img = tex.image as HTMLImageElement;
      mesh.scale.set(H * (img.width / img.height), H, 1);
    });
    const a = (i / n) * Math.PI * 2;
    const holder = new THREE.Group();
    holder.rotation.y = a;
    mesh.position.z = R;
    holder.add(mesh);
    ring.add(holder);
    // a thin orange edge under each photo
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.03), new THREE.MeshBasicMaterial({ color: 0xff7a2f, transparent: true, opacity: 0 }));
    edge.position.set(0, -H / 2 - 0.18, R);
    holder.add(edge);
    return { mesh, mat, edge, holder, lift: 0 };
  });

  // drag to spin, with inertia
  let angle = 0;
  let vel = reduce ? 0 : 0.0025;
  let dragging = false;
  let lastX = 0;
  let moved = 0;
  const pointer = new THREE.Vector2(9, 9);
  const ray = new THREE.Raycaster();
  let hovered = -1;

  function down(e: PointerEvent) {
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    host.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    vel = dx * 0.0045;
    angle += vel;
  }
  function up() {
    dragging = false;
  }
  function leave() {
    pointer.set(9, 9);
  }
  // click a photo to turn it to the front
  function click() {
    if (moved > 6 || hovered < 0) return;
    const target = -(hovered / n) * Math.PI * 2;
    const delta = Math.atan2(Math.sin(target - angle), Math.cos(target - angle));
    vel = delta * 0.08;
  }
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("click", click);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    // the page may be scaled up (--z), so draw at the size it shows on screen to stay sharp
    renderer.setPixelRatio(Math.min(devicePixelRatio * (canvas.getBoundingClientRect().width / w), 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back on narrow screens so the front photo still fits
    const narrow = w / h < 1;
    camera.position.set(0, 2.2, R + (narrow ? 13 : 10));
    // on tall, narrow screens aim a little lower so the ring sits higher, closer to the heading
    camera.lookAt(0, narrow ? -1.2 : 0.4, 0);
    camera.updateProjectionMatrix();
  }
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  resize();

  let visible = false;
  const viewObserver = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  viewObserver.observe(host);

  let front = -1;
  const world = new THREE.Vector3();
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    if (!dragging) {
      angle += vel;
      // ease back to a gentle drift after a fling
      vel += ((reduce ? 0 : 0.0025) - vel) * 0.03;
    }
    ring.rotation.y = angle;

    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(cards.map((c) => c.mesh))[0];
    hovered = hit ? cards.findIndex((c) => c.mesh === hit.object) : -1;
    host.style.cursor = dragging ? "grabbing" : hovered >= 0 ? "pointer" : "grab";

    let best = 0;
    let bestZ = -Infinity;
    cards.forEach((c, i) => {
      c.mesh.getWorldPosition(world);
      if (world.z > bestZ) {
        bestZ = world.z;
        best = i;
      }
      // photos at the back of the ring fade into the dark
      const facing = (world.z + R) / (2 * R);
      const lit = 0.25 + facing * 0.75;
      c.lift += ((i === hovered ? 1 : 0) - c.lift) * 0.12;
      c.mesh.position.z = R + c.lift * 0.9;
      c.mesh.position.y = c.lift * 0.15;
      c.mat.color.setScalar(c.mat.map ? Math.min(1, lit + c.lift * 0.2) : 0.15);
      c.edge.scale.x = c.mesh.scale.x;
      (c.edge.material as T.MeshBasicMaterial).opacity = c.lift;
    });
    const shown = hovered >= 0 ? hovered : best;
    if (shown !== front) {
      front = shown;
      onActive(shown);
    }
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("click", click);
    sizeObserver.disconnect();
    viewObserver.disconnect();
    cards.forEach((c) => {
      c.mesh.geometry.dispose();
      c.mat.map?.dispose();
      c.mat.dispose();
      c.edge.geometry.dispose();
      (c.edge.material as T.Material).dispose();
    });
    renderer.dispose();
  };
}
