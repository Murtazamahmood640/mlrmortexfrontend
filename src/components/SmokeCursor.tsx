import React, { useEffect } from "react";

/**
 * SimpleSmokeCursor
 * - very light smoke, smooth movement
 * - responds gently to page scroll
 *
 * Usage: <SimpleSmokeCursor /> once in App.tsx
 */

type Props = {
  color?: string;
  spawnPerMove?: number; // particles per mouse move event
  particleLife?: number; // ms
  forceEnable?: boolean; // set true to force on touch devices for testing
};

export default function SimpleSmokeCursor({
  color = "rgba(218, 189, 40, 0.08)",
  spawnPerMove = 2,
  particleLife = 700,
  forceEnable = false,
}: Props) {
  useEffect(() => {
    const isTouch =
      ("ontouchstart" in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    if (isTouch && !forceEnable) return; // skip on mobile by default

    // create canvas and append to body (so it's always on top)
    const canvas = document.createElement("canvas");
    canvas.id = "simple-smoke-canvas";
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    // use normal blend so color shows naturally; remove if you want screen blend
    canvas.style.mixBlendMode = "normal";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      age: number;
    }[] = [];

    function createParticle(x: number, y: number) {
      return {
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.05 - Math.random() * 0.25, // slight upward drift
        size: 3 + Math.random() * 6, // small sizes
        life: particleLife + (Math.random() * 200 - 100),
        age: 0,
      };
    }

    function spawn(x: number, y: number, count = 1) {
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(x, y));
      }
      // cap
      if (particles.length > 600) particles.splice(0, particles.length - 600);
    }

    // mouse
    function onMove(e: MouseEvent) {
      spawn(e.clientX, e.clientY, spawnPerMove);
    }
    window.addEventListener("mousemove", onMove);

    // scroll influence: measure delta and apply small velocity to particles
    let lastScroll = window.scrollY;
    function onScroll() {
      const now = window.scrollY;
      const delta = now - lastScroll;
      // apply small vy change to recent particles to create smooth drift with scroll
      for (let i = particles.length - 1; i >= Math.max(0, particles.length - 30); i--) {
        particles[i].vy += delta * 0.0015; // tiny influence
        particles[i].vx += (delta > 0 ? 0.002 : -0.002) * (Math.random() * 0.5 + 0.5);
      }
      lastScroll = now;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // animation loop (very simple)
    let last = performance.now();
    let raf = 0;
    function frame(now: number) {
      const dt = Math.min(32, now - last);
      last = now;

      // clear canvas each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        const lifeRatio = Math.max(0, 1 - p.age / p.life);
        if (lifeRatio <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        // movement
        p.vx *= 0.995;
        p.vy *= 0.998;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // draw as soft circle
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.65 * lifeRatio; // fade out
        // soft blur via shadow
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = Math.max(2, p.size * 0.9);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + lifeRatio * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // small idle emitter near center if user doesn't move mouse
    let idleTimer = 0;
    let idleHandle = window.setInterval(() => {
      idleTimer++;
      if (idleTimer > 10 && particles.length < 6) {
        spawn(window.innerWidth / 2 + (Math.random() - 0.5) * 80, window.innerHeight / 2 + (Math.random() - 0.5) * 80, 1);
      }
      // prevent timer runaway
      if (idleTimer > 1000) idleTimer = 0;
    }, 900);

    // reset idle timer on move
    function resetIdle() {
      idleTimer = 0;
    }
    window.addEventListener("mousemove", resetIdle);

    // cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("scroll", onScroll);
      clearInterval(idleHandle);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      particles = [];
    };
  }, [color, spawnPerMove, particleLife, forceEnable]);

  return null;
}
