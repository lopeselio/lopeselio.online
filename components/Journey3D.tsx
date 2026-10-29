"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";
import type { Chapter } from "@/content/site";

type Split = Pick<Chapter, "id" | "split" | "when" | "gold">;

// Matches the page: near-black background, warm ivory and greys, one orange accent.
const BG = 0x0c0e13;
const IVORY = 0xe9e3d8;
const WARM_GREY = 0x8d867c;
const SIGNAL = 0xff7a2f;

// The run as a 3D course behind the page: one checkpoint ring per chapter along a winding track.
// Scrolling flies the camera down the track, the pointer scatters the floating blocks, and
// clicking a checkpoint jumps to its chapter. The split timer stays the accessible way to navigate.
export default function Journey3D({ splits }: { splits: Split[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let stop = () => {};
    let cancelled = false;
    import("three").then((THREE) => {
      if (cancelled || !canvasRef.current || !labelsRef.current || !nextRef.current) return;
      stop = startCourse(THREE, canvasRef.current, labelsRef.current, nextRef.current, splits);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [splits]);

  return (
    <>
      <div className="journey" aria-hidden="true">
        <canvas ref={canvasRef} />
        <div ref={labelsRef} className="journey-labels">
          {splits.map((s, i) => (
            <span key={s.id} className="jl" data-gold={Boolean(s.gold)}>
              <b>{String(i + 1).padStart(2, "0")}</b> {s.split} <i>{s.when}</i>
            </span>
          ))}
        </div>
      </div>
      {/* Shown on phones only: the next checkpoint, pinned to the bottom of the screen */}
      <a ref={nextRef} className="jl-next" href="#" hidden />
    </>
  );
}

// Elements that sit over the canvas and should keep their own clicks.
const COVERED = "a, button, input, textarea, select, summary, label, video, .hud, .mcard, .chapter[data-feature='true'], #work, .moments, .closing";

function startCourse(
  THREE: typeof T,
  canvas: HTMLCanvasElement,
  labelRoot: HTMLDivElement,
  nextChip: HTMLAnchorElement,
  splits: Split[],
) {
  let renderer: T.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return () => {};
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 900;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 14, 66);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xfff4e8, 0x1a1712, 2.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(4, 10, 6);
  scene.add(sun);

  /* ---------- The track ---------- */
  const knots: T.Vector3[] = [];
  for (let i = 0; i <= 12; i++) knots.push(new THREE.Vector3(Math.sin(i * 0.85) * 6, Math.sin(i * 0.5) * 1.5, -i * 14));
  const curve = new THREE.CatmullRomCurve3(knots);
  const UP = new THREE.Vector3(0, 1, 0);
  const sideAt = (t: number) => curve.getTangentAt(t).cross(UP).normalize();
  const at = (t: number) => curve.getPointAt(Math.min(Math.max(t, 0), 1));

  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 800, 0.035, 6), new THREE.MeshBasicMaterial({ color: SIGNAL })));

  const railPts: number[] = [];
  const STEPS = 900;
  let prevL: T.Vector3 | null = null;
  let prevR: T.Vector3 | null = null;
  for (let k = 0; k <= STEPS; k++) {
    const t = k / STEPS;
    const p = at(t);
    const s = sideAt(t);
    const l = p.clone().addScaledVector(s, 1.6);
    const r = p.clone().addScaledVector(s, -1.6);
    if (prevL && prevR) railPts.push(...prevL.toArray(), ...l.toArray(), ...prevR.toArray(), ...r.toArray());
    if (k % 6 === 0) railPts.push(...l.toArray(), ...r.toArray());
    prevL = l;
    prevR = r;
  }
  const railGeo = new THREE.BufferGeometry();
  railGeo.setAttribute("position", new THREE.Float32BufferAttribute(railPts, 3));
  scene.add(new THREE.LineSegments(railGeo, new THREE.LineBasicMaterial({ color: IVORY, transparent: true, opacity: 0.22 })));

  const grid = new THREE.GridHelper(240, 80, 0x2c2a27, 0x1d1c1a);
  grid.position.y = -3.5;
  scene.add(grid);

  /* ---------- Checkpoints, one per chapter ---------- */
  const n = splits.length;
  const gateT = splits.map((_, i) => 0.13 + (i * 0.78) / Math.max(1, n - 1));
  const ringGeo = new THREE.TorusGeometry(2.2, 0.13, 14, 96);
  const pulseGeo = new THREE.TorusGeometry(2.2, 0.05, 8, 96);
  const gemGeo = new THREE.OctahedronGeometry(0.55);
  const inkColor = new THREE.Color(IVORY);
  const signalColor = new THREE.Color(SIGNAL);
  const gates = splits.map((s, i) => {
    const group = new THREE.Group();
    const p = at(gateT[i]);
    group.position.copy(p);
    group.lookAt(p.clone().add(curve.getTangentAt(gateT[i])));
    // a little self-lit so the rings read clearly against the dark
    const ringMat = new THREE.MeshStandardMaterial({ color: s.gold ? SIGNAL : IVORY, roughness: 0.35, metalness: 0.15, emissive: s.gold ? SIGNAL : IVORY, emissiveIntensity: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.6;
    const pulse = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0 }));
    pulse.position.y = 1.6;
    group.add(ring, pulse);
    let gem: T.Mesh | null = null;
    if (s.gold) {
      gem = new THREE.Mesh(gemGeo, new THREE.MeshStandardMaterial({ color: SIGNAL, flatShading: true, emissive: SIGNAL, emissiveIntensity: 0.3 }));
      gem.position.y = 4.9;
      group.add(gem);
    }
    scene.add(group);
    const top = new THREE.Vector3(0, 4.1 + (s.gold ? 1.6 : 0), 0);
    return { id: s.id, gold: Boolean(s.gold), group, ring, ringMat, pulse, gem, top, label: labelRoot.children[i] as HTMLElement };
  });

  /* ---------- Floating blocks the pointer can scatter ---------- */
  const COUNT = small ? 110 : 240;
  const blocks = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 }),
    COUNT,
  );
  const home: T.Vector3[] = [];
  const pos: T.Vector3[] = [];
  const vel: T.Vector3[] = [];
  const rot: T.Euler[] = [];
  const spin: number[] = [];
  const size: number[] = [];
  const base: T.Color[] = [];
  const heat = new Float32Array(COUNT);
  const palette = [new THREE.Color(0x4a4640), new THREE.Color(WARM_GREY), new THREE.Color(0xcfc7ba)];
  for (let i = 0; i < COUNT; i++) {
    // keep the opening stretch sparse so the hero text stays readable
    const t = 0.04 + Math.random() * 0.96;
    const side = (Math.random() < 0.5 ? -1 : 1) * ((t < 0.12 ? 7 : 3.5) + Math.random() * 13);
    const h = at(t).addScaledVector(sideAt(t), side);
    h.y += -1.5 + Math.random() * 8;
    home.push(h);
    pos.push(h.clone());
    vel.push(new THREE.Vector3());
    rot.push(new THREE.Euler(Math.random() * 6, Math.random() * 6, 0));
    spin.push((Math.random() - 0.5) * 0.02);
    size.push(0.15 + Math.random() ** 2 * 0.6);
    base.push(Math.random() < 0.12 ? signalColor.clone() : palette[(Math.random() * palette.length) | 0].clone());
    blocks.setColorAt(i, base[i]);
  }
  scene.add(blocks);

  const dustCount = small ? 900 : 2000;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const t = Math.random();
    const p = at(t).addScaledVector(sideAt(t), (Math.random() - 0.5) * 40);
    p.y += -3 + Math.random() * 14;
    p.toArray(dust, i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: IVORY, size: 0.06, transparent: true, opacity: 0.4 })));

  /* ---------- The runner, always just ahead of the camera ---------- */
  const runner = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshBasicMaterial({ color: SIGNAL }));
  scene.add(runner);
  const TRAIL = 70;
  const trailPts = new Float32Array(TRAIL * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPts, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.7 }));
  trail.frustumCulled = false;
  scene.add(trail);

  /* ---------- Scroll: map page position to a place on the track ---------- */
  let anchors: [number, number][] = [[0, 0]];
  let chapterY: number[] = [];
  function measure() {
    const vh = innerHeight;
    const docY = (el: Element | null) => (el ? el.getBoundingClientRect().top + scrollY : null);
    const list: [number, number][] = [[0, 0]];
    chapterY = [];
    splits.forEach((s, i) => {
      const y = docY(document.getElementById(s.id));
      if (y === null) return;
      chapterY[i] = y - vh * 0.5;
      list.push([Math.max(y - vh * 0.4, list[list.length - 1][0] + 1), gateT[i] - 0.012]);
    });
    list.push([Math.max(document.documentElement.scrollHeight - vh, list[list.length - 1][0] + 1), 0.97]);
    anchors = list;
  }
  function scrollT() {
    const y = scrollY;
    for (let i = 1; i < anchors.length; i++) {
      const [y0, t0] = anchors[i - 1];
      const [y1, t1] = anchors[i];
      if (y <= y1) return t0 + (t1 - t0) * Math.max(0, (y - y0) / (y1 - y0));
    }
    return anchors[anchors.length - 1][1];
  }
  function activeChapter() {
    let a = -1;
    chapterY.forEach((y, i) => {
      if (scrollY >= y) a = i;
    });
    return a;
  }

  /* ---------- Pointer ---------- */
  const pointer = new THREE.Vector2();
  const screen = { x: -1, y: -1 };
  let pointerIn = false;
  let pointerFree = false;
  const look = { x: 0, y: 0 };
  let hovered = -1;
  const ray = new THREE.Raycaster();

  function onMove(e: PointerEvent) {
    screen.x = e.clientX;
    screen.y = e.clientY;
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    pointerIn = true;
    pointerFree = !(e.target instanceof Element && e.target.closest(COVERED));
  }
  function onLeave() {
    pointerIn = false;
    hovered = -1;
  }
  function onClick(e: MouseEvent) {
    if (e.target instanceof Element && e.target.closest(COVERED)) return;
    if (!getSelection()?.isCollapsed) return;
    // Touch screens have no hover: a tap on a visible checkpoint label counts instead.
    if (hovered < 0) {
      hovered = gates.findIndex((g) => {
        if (Number(g.label.style.opacity) < 0.3) return false;
        const r = g.label.getBoundingClientRect();
        return e.clientX >= r.left - 8 && e.clientX <= r.right + 8 && e.clientY >= r.top - 8 && e.clientY <= r.bottom + 8;
      });
    }
    if (hovered >= 0) {
      const el = document.getElementById(gates[hovered].id);
      if (el) {
        history.pushState(null, "", `#${gates[hovered].id}`);
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
      return;
    }
    // Empty space: a shockwave that knocks nearby blocks away.
    ray.setFromCamera(pointer, camera);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const d = Math.sqrt(ray.ray.distanceSqToPoint(pos[i]));
      if (d > 7) continue;
      ray.ray.closestPointToPoint(pos[i], tmp);
      vel[i].add(pos[i].clone().sub(tmp).normalize().multiplyScalar(0.9 * (1 - d / 7)));
      heat[i] = 1.4;
    }
  }

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // On wide screens, push the vanishing point right so the course stays clear of the text column.
    if (w > 900) camera.setViewOffset(w, h, -w * 0.14, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    measure();
  }

  addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  addEventListener("click", onClick);
  addEventListener("resize", resize);
  const bodyObserver = new ResizeObserver(measure);
  bodyObserver.observe(document.body);
  document.fonts?.ready.then(measure);
  resize();

  /* ---------- Frame ---------- */
  let camT = scrollT();
  let time = 0;
  let frame = 0;
  const clock = new THREE.Timer();
  const dummy = new THREE.Object3D();
  const tmpV = new THREE.Vector3();
  const closest = new THREE.Vector3();
  const tmpColor = new THREE.Color();
  const motion = reduce ? 0 : 1;

  function tick() {
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt * motion;
    camT += (scrollT() - camT) * (reduce ? 1 : 1 - Math.pow(0.02, dt));
    look.x += ((pointerIn ? pointer.x : 0) - look.x) * 0.05;
    look.y += ((pointerIn ? pointer.y : 0) - look.y) * 0.05;

    const side = sideAt(Math.min(camT, 1));
    camera.position.copy(at(camT)).addScaledVector(side, look.x * 1.4);
    camera.position.y += 2.6 + look.y * 0.9;
    const target = at(camT + 0.045);
    target.y += 1.3;
    camera.lookAt(target);
    grid.position.set(Math.round(camera.position.x / 3) * 3, -3.5, Math.round(camera.position.z / 3) * 3);

    // runner and its trail
    const rp = at(camT + 0.06);
    rp.addScaledVector(side, Math.cos(time * 2.1) * 0.9);
    rp.y += 1.3 + Math.sin(time * 3.3) * 0.3;
    runner.position.copy(rp);
    runner.rotation.y += 0.04 * motion + 0.005;
    trailPts.copyWithin(3, 0, (TRAIL - 1) * 3);
    rp.toArray(trailPts, 0);
    if (frame === 0) for (let i = 1; i < TRAIL; i++) rp.toArray(trailPts, i * 3);
    trailGeo.attributes.position.needsUpdate = true;

    // blocks
    const aiming = pointerIn && pointerFree;
    if (aiming) ray.setFromCamera(pointer, camera);
    for (let i = 0; i < COUNT; i++) {
      if (aiming) {
        const d2 = ray.ray.distanceSqToPoint(pos[i]);
        if (d2 < 6.25) {
          ray.ray.closestPointToPoint(pos[i], closest);
          vel[i].add(tmpV.copy(pos[i]).sub(closest).normalize().multiplyScalar(0.05 * (1 - d2 / 6.25)));
          heat[i] = Math.max(heat[i], 1);
        }
      }
      vel[i].addScaledVector(tmpV.copy(home[i]).sub(pos[i]), 0.012).multiplyScalar(0.9);
      pos[i].add(vel[i]);
      heat[i] *= 0.965;
      rot[i].x += spin[i] * (motion + heat[i] * 5);
      rot[i].y += spin[i] * (motion + heat[i] * 5);
      dummy.position.copy(pos[i]);
      dummy.position.y += Math.sin(time * 0.6 + i) * 0.15;
      dummy.rotation.copy(rot[i]);
      dummy.scale.setScalar(size[i] * (1 + Math.min(heat[i], 1) * 0.35));
      dummy.updateMatrix();
      blocks.setMatrixAt(i, dummy.matrix);
      blocks.setColorAt(i, tmpColor.copy(base[i]).lerp(signalColor, Math.min(heat[i], 1)));
    }
    blocks.instanceMatrix.needsUpdate = true;
    if (blocks.instanceColor) blocks.instanceColor.needsUpdate = true;

    // While a chapter is being read, dim the course so it sits behind the words.
    const active = activeChapter();
    const reading = chapterY.length > 0 && scrollY > chapterY[0];
    // phones have no side margin, so the course sits right behind the words: dim it further there
    dim += ((reading ? (innerWidth < 900 ? 0.3 : 0.5) : 1) - dim) * 0.06;
    canvas.style.opacity = dim.toFixed(3);
    const w = innerWidth;
    const h = innerHeight;
    let best = -1;
    let bestD = Infinity;
    gates.forEach((g, i) => {
      const isActive = i === active;
      const isHover = i === hovered;
      g.ring.rotation.z += (0.002 + (isHover ? 0.03 : 0)) * (motion || 0.3);
      g.ring.scale.setScalar(THREE.MathUtils.lerp(g.ring.scale.x, isHover ? 1.12 : 1, 0.15));
      if (!g.gold) g.ringMat.color.lerp(isActive || isHover ? signalColor : inkColor, 0.08);
      if (g.gem) {
        g.gem.rotation.y += 0.025 * motion + 0.003;
        g.gem.position.y = 4.9 + Math.sin(time * 2 + i) * 0.25;
      }
      const phase = (time * 0.7 + i * 0.13) % 1;
      const pm = g.pulse.material as T.MeshBasicMaterial;
      g.pulse.scale.setScalar(1 + phase * 0.7);
      pm.opacity = isActive || isHover ? (1 - phase) * 0.8 : 0;

      // label above the ring
      tmpV.copy(g.top).applyMatrix4(g.group.matrixWorld).project(camera);
      const dist = camera.position.distanceTo(g.group.position);
      const visible = tmpV.z < 1 && dist > 3.5;
      // only the current and next checkpoints get a label, so labels don't crowd the text
      const labelled = i === active || i === active + 1;
      const fade = visible && labelled ? Math.min(1, Math.max(0, (62 - dist) / 26)) : 0;
      g.label.style.opacity = String(fade);
      g.label.style.transform = `translate(${((tmpV.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-tmpV.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%, -100%)`;
      g.label.dataset.active = String(isActive);
      g.label.dataset.hover = String(isHover);

      // hover test: pointer inside the ring's projected circle
      if (pointerIn && pointerFree && visible && dist < 60) {
        const c = tmpV.set(0, 1.6, 0).applyMatrix4(g.group.matrixWorld).project(camera);
        const cx = (c.x * 0.5 + 0.5) * w;
        const cy = (-c.y * 0.5 + 0.5) * h;
        const e = tmpV.set(2.2, 1.6, 0).applyMatrix4(g.group.matrixWorld).project(camera);
        const rad = Math.max(24, Math.hypot((e.x * 0.5 + 0.5) * w - cx, (-e.y * 0.5 + 0.5) * h - cy) * 1.1);
        const d = Math.hypot(screen.x - cx, screen.y - cy);
        if (d < rad && d < bestD) {
          best = i;
          bestD = d;
        }
      }
    });
    hovered = best;

    // Phones: the next checkpoint as a pinned card (floating labels would sit behind the story text there).
    const next = active + 1;
    if (next !== shownNext) {
      shownNext = next;
      const s = splits[next];
      // hidden in the header, where "Start the run" already points at the first chapter
      nextChip.hidden = !s || next === 0;
      if (s) {
        nextChip.href = `#${s.id}`;
        nextChip.dataset.gold = String(Boolean(s.gold));
        nextChip.innerHTML = `<span>Next</span><b>${String(next + 1).padStart(2, "0")}</b> ${s.split} <i>${s.when}</i>`;
      }
    }
    document.documentElement.style.cursor = hovered >= 0 ? "pointer" : "";

    renderer.render(scene, camera);
    frame++;
  }
  let dim = 1;
  let shownNext = -2;
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    tick();
  };
  loop();
  canvas.classList.add("on");

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    removeEventListener("click", onClick);
    removeEventListener("resize", resize);
    bodyObserver.disconnect();
    document.documentElement.style.cursor = "";
    scene.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mat = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
  };
}
