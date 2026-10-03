// Animated "constellation" background shared by every page: drifting nodes joined
// by thin lines, with small pulses flowing along them. Moving the cursor lights
// up the nearby part of the network and links the cursor to the closest nodes.

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

export type ConstellationOptions = {
  nodeCount?: number;
  connectionDistance?: number;
  speed?: number;
};

const LINE_RGB = "30, 80, 160"; // dark blue lines
const NODE_RGB = "30, 80, 160";
const HOVER_RGB = "125, 211, 252"; // bright cyan used near the cursor
const HOVER_RADIUS = 190; // how far the cursor's highlight reaches (px)

function createParticles(count: number, speed: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const s = speed * (0.6 + Math.random() * 0.4);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s,
      radius: 1.5 + Math.random() * 1.2,
    };
  });
}

// Mix two "r, g, b" colours: t = 0 gives a, t = 1 gives b.
function mixRgb(a: string, b: string, t: number): string {
  const pa = a.split(",").map(Number);
  const pb = b.split(",").map(Number);
  return pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(", ");
}

/** Starts the animation on `canvas`. Returns a cleanup function that stops it. */
export function startConstellation(canvas: HTMLCanvasElement, options: ConstellationOptions = {}): () => void {
  const { nodeCount = 30, connectionDistance = 170, speed = 0.3 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = createParticles(nodeCount, speed, width, height);
  let animFrameId = 0;
  canvas.width = width;
  canvas.height = height;

  // Cursor position; `strength` eases in/out so the glow fades smoothly.
  const pointer = { x: 0, y: 0, active: false, strength: 0 };

  // 0..1 — how strongly a point is lit by the cursor.
  const hoverAt = (x: number, y: number): number => {
    if (pointer.strength === 0) return 0;
    const d = Math.hypot(x - pointer.x, y - pointer.y);
    return d < HOVER_RADIUS ? (1 - d / HOVER_RADIUS) * pointer.strength : 0;
  };

  const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles = createParticles(nodeCount, speed, width, height);
  };
  const handlePointerMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };
  const handlePointerLeave = () => {
    pointer.active = false;
  };

  const draw = (time = performance.now()) => {
    pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;
    if (pointer.strength < 0.01) pointer.strength = 0;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Move nodes, bouncing off the edges
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) {
        p.x = Math.max(0, Math.min(width, p.x));
        p.vx *= -1;
      }
      if (p.y < 0 || p.y > height) {
        p.y = Math.max(0, Math.min(height, p.y));
        p.vy *= -1;
      }
    }

    // Soft glow under the cursor
    if (pointer.strength > 0) {
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, HOVER_RADIUS);
      glow.addColorStop(0, `rgba(99, 102, 241, ${(0.24 * pointer.strength).toFixed(3)})`);
      glow.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(pointer.x - HOVER_RADIUS, pointer.y - HOVER_RADIUS, HOVER_RADIUS * 2, HOVER_RADIUS * 2);
    }

    // Connecting lines (brighter and thicker near the cursor) with flowing pulses
    let lineIndex = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist >= connectionDistance) continue;

        const baseAlpha = (1 - dist / connectionDistance) * 0.45;
        const h = hoverAt((a.x + b.x) / 2, (a.y + b.y) / 2);
        const alpha = Math.min(1, baseAlpha * (1 + 2.6 * h) + 0.25 * h);
        ctx.lineWidth = 0.6 + 1.1 * h;
        ctx.strokeStyle = `rgba(${mixRgb(LINE_RGB, HOVER_RGB, h)}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        lineIndex++;
        if (lineIndex % 3 === 0) {
          const seed = i * 17 + j * 31;
          const progress = (((time * 0.00045 + seed * 0.1) % 1) + 1) % 1;
          ctx.beginPath();
          ctx.arc(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress, 1.4 + h, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(90, 160, 255, ${Math.min(1, alpha * 1.6).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    // Thin links from the cursor to the nearest nodes
    if (pointer.strength > 0) {
      ctx.lineWidth = 0.8;
      for (const p of particles) {
        const h = hoverAt(p.x, p.y);
        if (h <= 0) continue;
        ctx.strokeStyle = `rgba(${HOVER_RGB}, ${(h * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }

    // Nodes on top (grow and glow near the cursor)
    for (const p of particles) {
      const h = hoverAt(p.x, p.y);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (1 + 0.9 * h), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${mixRgb(NODE_RGB, HOVER_RGB, h)}, ${(0.85 + 0.15 * h).toFixed(3)})`;
      if (h > 0) {
        ctx.shadowColor = `rgba(${HOVER_RGB}, ${h.toFixed(3)})`;
        ctx.shadowBlur = 14 * h;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animFrameId = requestAnimationFrame(draw);
  };

  animFrameId = requestAnimationFrame(draw);
  window.addEventListener("resize", handleResize);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("blur", handlePointerLeave);

  return () => {
    cancelAnimationFrame(animFrameId);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("pointermove", handlePointerMove);
    document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("blur", handlePointerLeave);
  };
}
