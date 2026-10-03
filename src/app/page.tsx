"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Google Fonts for futuristic typography (no layout.tsx modification needed)
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;800;900&display=swap";

/* ─── Original Background Canvas (Restored from First Working Version) ─────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const NODE_COUNT = 35;
const CONNECTION_DISTANCE = 180;
const SPEED = 0.35; // slow, smooth, and clearly visible continuous movement
const NODE_COLOR = "rgba(30, 80, 160, 0.85)";
const LINE_COLOR_BASE = "30, 80, 160"; // RGB for dark blue lines

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
  { label: "COLLABS", href: "#collabs" },
  { label: "HACKATHON", href: "#hackathon" },
  { label: "TIMELINE", href: "/timeline" },
  { label: "ABOUT", href: "#about" },
];

const COLOR_IDLE = "rgba(200, 210, 230, 0.8)";
const COLOR_ACTIVE = "#3b82f6";
const COLOR_HOVER = "#ffffff";

/* ─── Homepage Component ────────────────────────────────────────────────────── */
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>(pathname);

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  /* ── Background canvas animation ── */
  useEffect(() => {
    // Dynamically inject Google Fonts if not already loaded
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
      // Pure black background (#000000)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Continuously move nodes with soft boundary bounce
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

      // Draw thin dark-blue connecting lines & subtle flowing pulses
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
            // Line alpha fades with distance
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;
            ctx.strokeStyle = `rgba(${LINE_COLOR_BASE}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Subtle flowing movement along existing network paths
            lineIndex++;
            if (lineIndex % 3 === 0) {
              const flowSpeed = 0.00045; // very slow, smooth
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

      // Draw nodes on top of lines
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
      {/* ── Original animated canvas background (pure black + dark blue network) ── */}
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
          {/* Original logo symbol: gold/yellow only */}
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

        {/* Navigation Items */}
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
            href="#register"
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

      {/* ── Hero section: left open for network, right holds resized shield ── */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <section
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            paddingTop: "64px",
          }}
        >
          {/* Left: Hero typography with blue+purple gradient, subtle glow and sparkles */}
          <div
            style={{
              flex: "0 0 54%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 1.5rem 0 4rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Sparkles / glitter effect styles */}
            <style>{`
              @keyframes sparkleTwinkle {
                0%, 100% { opacity: 0; transform: scale(0.2) rotate(0deg); }
                50% { opacity: 0.9; transform: scale(1) rotate(45deg); }
              }
              @keyframes textGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>

            <div style={{ position: "relative", display: "inline-block", maxWidth: "max-content" }}>
              {/* Subtle elegant sparkle stars */}
              {/* Sparkle 1: Top near subtitle */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                position: "absolute", top: "-14px", left: "220px",
                animation: "sparkleTwinkle 3.2s ease-in-out infinite", animationDelay: "0.2s",
                pointerEvents: "none", filter: "drop-shadow(0 0 4px #93c5fd)"
              }}>
                <path d="M6 0 C6 3.3 8.7 6 12 6 C8.7 6 6 8.7 6 12 C6 8.7 3.3 6 0 6 C3.3 6 6 3.3 6 0 Z" fill="#93c5fd" />
              </svg>

              {/* Sparkle 2: Near CYBER 'C' */}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{
                position: "absolute", top: "34px", left: "-16px",
                animation: "sparkleTwinkle 3.8s ease-in-out infinite", animationDelay: "1.4s",
                pointerEvents: "none", filter: "drop-shadow(0 0 5px #c084fc)"
              }}>
                <path d="M6 0 C6 3.3 8.7 6 12 6 C8.7 6 6 8.7 6 12 C6 8.7 3.3 6 0 6 C3.3 6 6 3.3 6 0 Z" fill="#c084fc" />
              </svg>

              {/* Sparkle 3: Near CYBER 'R' */}
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{
                position: "absolute", top: "42px", right: "28px",
                animation: "sparkleTwinkle 4.1s ease-in-out infinite", animationDelay: "2.5s",
                pointerEvents: "none", filter: "drop-shadow(0 0 5px #60a5fa)"
              }}>
                <path d="M6 0 C6 3.3 8.7 6 12 6 C8.7 6 6 8.7 6 12 C6 8.7 3.3 6 0 6 C3.3 6 6 3.3 6 0 Z" fill="#60a5fa" />
              </svg>

              {/* Sparkle 4: Near MONTH '-' */}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{
                position: "absolute", bottom: "35px", right: "145px",
                animation: "sparkleTwinkle 3.5s ease-in-out infinite", animationDelay: "0.9s",
                pointerEvents: "none", filter: "drop-shadow(0 0 4px #e879f9)"
              }}>
                <path d="M6 0 C6 3.3 8.7 6 12 6 C8.7 6 6 8.7 6 12 C6 8.7 3.3 6 0 6 C3.3 6 6 3.3 6 0 Z" fill="#e879f9" />
              </svg>

              {/* Sparkle 5: Near 2026 '6' */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                position: "absolute", bottom: "-6px", right: "-12px",
                animation: "sparkleTwinkle 3.9s ease-in-out infinite", animationDelay: "1.8s",
                pointerEvents: "none", filter: "drop-shadow(0 0 5px #93c5fd)"
              }}>
                <path d="M6 0 C6 3.3 8.7 6 12 6 C8.7 6 6 8.7 6 12 C6 8.7 3.3 6 0 6 C3.3 6 6 3.3 6 0 Z" fill="#93c5fd" />
              </svg>

              {/* "IEEE COMPUTER SOCIETY PRESENTS" */}
              <p
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: "0.85rem",
                  background: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 12px rgba(96, 165, 250, 0.35))",
                }}
              >
                IEEE COMPUTER SOCIETY PRESENTS
              </p>

              {/* "CYBER MONTH -2026" */}
              <h1
                style={{
                  fontFamily: "'Unbounded', 'Space Grotesk', system-ui, sans-serif",
                  fontSize: "clamp(3.15rem, 4.7vw, 4.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  margin: 0,
                  background:
                    "linear-gradient(125deg, #60a5fa 0%, #a855f7 40%, #c084fc 70%, #38bdf8 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "textGradientShift 9s ease infinite",
                  filter:
                    "drop-shadow(0 0 20px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 45px rgba(59, 130, 246, 0.25))",
                }}
              >
                CYBER
                <br />
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>MONTH -2026</span>
              </h1>
            </div>
          </div>

          {/* Right: cybersecurity shield image reduced in size by ~28% */}
          <div
            style={{
              flex: "0 0 48%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 2.5rem 2rem 0",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "415px", // Slightly increased
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow:
                  "0 0 65px rgba(30, 80, 200, 0.15), 0 0 150px rgba(10, 30, 80, 0.28)",
              }}
            >
              {/* Edge fades for natural blending into black background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "20%",
                  background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "20%",
                  background: "linear-gradient(to top, #000 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "14%",
                  background: "linear-gradient(to right, #000 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "10%",
                  background: "linear-gradient(to left, #000 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />

              <Image
                src="/cyber-shield.jpg"
                alt="Cybersecurity network shield visualization"
                width={1024}
                height={1024}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  mixBlendMode: "lighten",
                  filter: "saturate(0.88) brightness(0.96)",
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}