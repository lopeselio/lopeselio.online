"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";

// Behind the launch chapter: a spiral of glowing points, one for every few hundred transactions.
// It spins out when the chapter comes into view, the pointer stirs it, and a click sends a wave through it.
export default function LaunchField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop = () => {};
    let cancelled = false;
    import("three").then((THREE) => {
      const host = wrapRef.current?.parentElement;
      if (cancelled || !host || !canvasRef.current) return;
      stop = startField(THREE, host, canvasRef.current);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <div ref={wrapRef} className="launchfield" aria-hidden="true">
      <canvas ref={canvasRef} />
      <p className="launch-hint">Move to stir it. Click to send a wave of transactions.</p>
    </div>
  );
}

const vertex = /* glsl */ `
  attribute vec3 seed;     // radius, angle, height
  attribute vec3 tint;
  attribute float size;
  uniform float uSpin, uClock, uExpand, uShockAt, uPixel;
  uniform vec2 uMouse, uShockPos;
  varying vec3 vTint;
  varying float vBoost;

  void main() {
    float e = 1.0 - pow(1.0 - uExpand, 3.0);
    float r = seed.x * e;
    float a = seed.y + uSpin * 0.9 / (0.6 + seed.x * 0.22);
    vec4 wp = modelMatrix * vec4(cos(a) * r, seed.z * e, sin(a) * r, 1.0);

    vec2 d = wp.xy - uMouse;
    float push = smoothstep(3.2, 0.0, length(d));
    wp.xy += normalize(d + 1e-4) * push * 1.4;
    wp.z += push * 1.2;

    float age = uClock - uShockAt;
    float ring = exp(-pow(length(wp.xy - uShockPos) - age * 9.0, 2.0) * 0.5) * exp(-age * 0.8) * step(0.0, age);
    wp.z += ring * 2.2;

    vBoost = ring + push * 0.6;
    vTint = tint;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = size * uPixel * (1.0 + vBoost) * (34.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vTint;
  varying float vBoost;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vTint * (1.15 + vBoost * 1.8), a);
  }
`;

function startField(THREE: typeof T, host: HTMLElement, canvas: HTMLCanvasElement) {
  let renderer: T.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  } catch {
    return () => {};
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 900;
  const pixel = Math.min(devicePixelRatio, small ? 1.5 : 2);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  const N = small ? 7000 : 16000;
  const seed = new Float32Array(N * 3);
  const tint = new Float32Array(N * 3);
  const size = new Float32Array(N);
  const inner = new THREE.Color(0xfff1e0);
  const mid = new THREE.Color(0xff7a2f);
  const outer = new THREE.Color(0x6b2412);
  const c = new THREE.Color();
  const randn = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  for (let i = 0; i < N; i++) {
    const r = Math.pow(Math.random(), 1.5) * 11 + 0.15;
    const arm = ((i % 3) / 3) * Math.PI * 2;
    seed[i * 3] = r;
    seed[i * 3 + 1] = arm + r * 0.45 + randn() * 0.5 * (1.3 - r / 12);
    seed[i * 3 + 2] = randn() * 0.5 * (1 - r / 13);
    const k = r / 11;
    if (k < 0.35) c.copy(inner).lerp(mid, k / 0.35);
    else c.copy(mid).lerp(outer, (k - 0.35) / 0.65);
    c.toArray(tint, i * 3);
    size[i] = 0.5 + Math.random() * 1.3 + (Math.random() < 0.02 ? 2.5 : 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute("seed", new THREE.BufferAttribute(seed, 3));
  geo.setAttribute("tint", new THREE.BufferAttribute(tint, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
  const uniforms = {
    uSpin: { value: 0 },
    uClock: { value: 0 },
    uExpand: { value: reduce ? 1 : 0 },
    uShockAt: { value: -100 },
    uPixel: { value: pixel },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uShockPos: { value: new THREE.Vector2() },
  };
  const galaxy = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  galaxy.frustumCulled = false;
  galaxy.rotation.set(1.05, 0, 0.35);
  scene.add(galaxy);

  /* pointer: map onto the plane through the galaxy's centre */
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const mouseTarget = new THREE.Vector2(999, 999);
  function toWorld(e: PointerEvent | MouseEvent) {
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    return ray.ray.intersectPlane(plane, hit) ? hit : null;
  }
  function onMove(e: PointerEvent) {
    const p = toWorld(e);
    if (p) mouseTarget.set(p.x, p.y);
  }
  function onLeave() {
    mouseTarget.set(999, 999);
  }
  function onClick(e: MouseEvent) {
    if (e.target instanceof Element && e.target.closest("a, button")) return;
    if (!getSelection()?.isCollapsed) return;
    const p = toWorld(e);
    if (!p) return;
    uniforms.uShockPos.value.set(p.x, p.y);
    uniforms.uShockAt.value = uniforms.uClock.value;
  }
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("click", onClick);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    // the page may be scaled up (--z), so draw at the size it shows on screen to stay sharp
    renderer.setPixelRatio(Math.min(pixel * (canvas.getBoundingClientRect().width / w), 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Sit the galaxy to the right of the story on wide screens.
    if (w > 900) camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  resize();

  let visible = false;
  let expanding = false;
  const viewObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !expanding) expanding = true;
    },
    { threshold: 0.12 },
  );
  viewObserver.observe(host);

  let lastY = scrollY;
  let boost = 0;
  const clock = new THREE.Timer();
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.05);
    const dy = Math.abs(scrollY - lastY);
    lastY = scrollY;
    if (!visible) return;
    boost += (Math.min(dy * 0.08, 3) - boost) * 0.08;
    uniforms.uClock.value += dt;
    uniforms.uSpin.value += dt * (reduce ? 0 : 0.35 + boost);
    if (expanding) uniforms.uExpand.value = Math.min(1, uniforms.uExpand.value + dt / 2.4);
    const far = mouseTarget.x > 900 || uniforms.uMouse.value.x > 900;
    uniforms.uMouse.value.lerp(mouseTarget, far ? 1 : 0.12);
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("click", onClick);
    sizeObserver.disconnect();
    viewObserver.disconnect();
    geo.dispose();
    (galaxy.material as T.Material).dispose();
    renderer.dispose();
  };
}
