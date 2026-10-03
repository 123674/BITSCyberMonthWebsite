"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Google Fonts for futuristic typography
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;800;900&display=swap";

/* ─── Background Canvas (Consistent Dark-Blue Network) ──────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const NODE_COUNT = 30;
const CONNECTION_DISTANCE = 170;
const SPEED = 0.3;
const NODE_COLOR = "rgba(30, 80, 160, 0.85)";
const LINE_COLOR_BASE = "30, 80, 160";

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: NODE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED * (0.6 + Math.random() * 0.4);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.5 + Math.random() * 1.2,
    };
  });
}

/* ─── Navigation Links ──────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "COLLABS", href: "/#collabs" },
  { label: "HACKATHON", href: "/#hackathon" },
  { label: "TIMELINE", href: "/timeline" },
  { label: "ABOUT", href: "/#about" },
];

const COLOR_IDLE = "rgba(200, 210, 230, 0.8)";
const COLOR_ACTIVE = "#3b82f6";
const COLOR_HOVER = "#ffffff";

/* ─── Timeline Page Component ───────────────────────────────────────────────── */
export default function TimelinePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>(pathname);

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  /* ── Background canvas animation ── */
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = createParticles(width, height);
    let animFrameId: number;

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = createParticles(width, height);
    };

    const draw = (time = performance.now()) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        }
        if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        }
        if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }
      }

      ctx.lineWidth = 0.6;
      let lineIndex = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;
            ctx.strokeStyle = `rgba(${LINE_COLOR_BASE}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            lineIndex++;
            if (lineIndex % 3 === 0) {
              const flowSpeed = 0.00045;
              const seed = i * 17 + j * 31;
              const progress = ((time * flowSpeed + seed * 0.1) % 1 + 1) % 1;

              const px = a.x + (b.x - a.x) * progress;
              const py = a.y + (b.y - a.y) * progress;

              ctx.beginPath();
              ctx.arc(px, py, 1.4, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(90, 160, 255, ${(alpha * 1.6).toFixed(3)})`;
              ctx.fill();
            }
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = NODE_COLOR;
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    animFrameId = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return activeHref === href;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Fixed background canvas (pure black + dark-blue network) ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "block",
          background: "#000000",
          zIndex: 0,
        }}
      />

      {/* ── Fixed Header / Navbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.8rem",
          background: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setActiveHref("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            marginLeft: "0.25rem",
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="19" cy="19" r="17" stroke="#D4A017" strokeWidth="2" />
            <circle cx="19" cy="19" r="11" stroke="#D4A017" strokeWidth="1.5" />
            <line x1="19" y1="8" x2="19" y2="30" stroke="#D4A017" strokeWidth="1.8" />
            <line x1="10" y1="19" x2="28" y2="19" stroke="#D4A017" strokeWidth="1.8" />
            <circle cx="19" cy="19" r="3.5" fill="#D4A017" />
          </svg>
          <span
            style={{
              fontFamily: "'Orbitron', 'Space Grotesk', system-ui, sans-serif",
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BMSCE IEEE CS
          </span>
        </Link>

        {/* Navigation Items (TIMELINE active in blue) */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  fontWeight: active ? 600 : 500,
                  color: active ? COLOR_ACTIVE : COLOR_IDLE,
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = COLOR_HOVER;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = COLOR_IDLE;
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* REGISTER Button */}
          <Link
            href="/#register"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#ffffff",
              textDecoration: "none",
              background: "linear-gradient(90deg, #2563eb 0%, #9333ea 100%)",
              padding: "0.42rem 1.1rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            REGISTER <span style={{ fontSize: "0.7rem", opacity: 0.9 }}>›</span>
          </Link>
        </nav>
      </header>

      {/* ── Main Timeline Content ── */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "100px 1.5rem 5rem",
        }}
      >
        {/* Large Centered Heading in BLOCK LETTERS with Subtle Blue/Purple Glow */}
        <h1
          style={{
            fontFamily: "'Unbounded', 'Space Grotesk', system-ui, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            margin: "0 0 2.5rem",
            background:
              "linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(0 0 25px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.25))",
          }}
        >
          TIMELINE
        </h1>

        {/* Centered Timeline Flowchart Visual */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "460px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.2rem",
            borderRadius: "20px",
            background: "rgba(10, 15, 30, 0.45)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            boxShadow:
              "0 0 50px rgba(99, 102, 241, 0.2), 0 0 100px rgba(168, 85, 247, 0.12)",
          }}
        >
          <Image
            src="/timeline-flowchart.png"
            alt="Event Timeline Flowchart"
            width={500}
            height={600}
            priority
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
              filter: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.2))",
            }}
          />
        </div>
      </main>
    </>
  );
}
