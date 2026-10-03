"use client";

import Image from "next/image";
import SiteChrome from "@/components/site/SiteChrome";
import { useReveal } from "@/components/site/useReveal";
import EventTimeline from "@/components/home/EventTimeline";
import type { EventCardData } from "@/lib/eventCards";

/* ─── Homepage Component ────────────────────────────────────────────────────── */
export default function HomePage({ timelineEvents }: { timelineEvents: EventCardData[] }) {
  useReveal();


  return (
    <SiteChrome constellation={{ nodeCount: 35, connectionDistance: 180, speed: 0.35 }}>

      {/* ── Hero section: left open for network, right holds resized shield ── */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <section className="hero-section">
          {/* Left: Hero typography with blue+purple gradient, subtle glow and sparkles */}
          <div className="hero-text">
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

            <div className="reveal-onload hero-heading">
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

              {/* "BMSCE IEEE CS SOCIETY PRESENTS" */}
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
                BMSCE IEEE CS SOCIETY PRESENTS
              </p>

              {/* "CYBER MONTH -2026" */}
              <h1
                className="hero-title"
                style={{
                  fontFamily: "var(--font-heading), 'Space Grotesk', system-ui, sans-serif",
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

            {/* Tagline */}
            <p
              className="reveal-onload"
              style={{
                animationDelay: "180ms",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                marginTop: "1.4rem",
                marginBottom: 0,
                background: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(96, 165, 250, 0.35))",
              }}
            >
              Learn. Secure. Innovate. Defend.
            </p>

            {/* Cyber Month description */}
            <p
              className="reveal-onload"
              style={{
                animationDelay: "340ms",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "1.08rem",
                lineHeight: 1.7,
                color: "rgba(200, 210, 230, 0.85)",
                maxWidth: "560px",
                marginTop: "0.9rem",
                marginBottom: 0,
              }}
            >
              Cyber Month 2026 is a month-long cybersecurity initiative featuring technical
              challenges, workshops, awareness activities, and hands-on experiences designed to
              help students build practical cybersecurity skills and become more aware of the
              evolving digital threat landscape.
            </p>
          </div>

          {/* Right: cybersecurity shield image reduced in size by ~28% (floats gently) */}
          <div
            className="hero-float hero-visual"
          >
            {/* Pulsing glow behind the shield */}
            <div className="hero-glow" aria-hidden="true" />
            <div
              className="reveal-onload"
              style={{
                animationDelay: "250ms",
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
              {/* Scanning light line sweeping over the shield */}
              <div className="hero-scan" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ── Event timeline (built from published events) ── */}
        <EventTimeline events={timelineEvents} />
      </main>
    </SiteChrome>
  );
}