"use client";

// Shared animated background + fixed header used by every public page.
// On narrow screens the navigation collapses into a menu button.

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { startConstellation, type ConstellationOptions } from "@/components/site/constellation";

// Google Fonts for futuristic typography
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap";

/* ─── Navigation Links ──────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "TIMELINE", href: "/#timeline" },
  { label: "ABOUT", href: "/about" },
];

/* ─── Site Chrome Component ──────────────────────────────────────────────────── */
export default function SiteChrome({
  children,
  constellation = { nodeCount: 30, connectionDistance: 170, speed: 0.3 },
}: {
  children: React.ReactNode;
  constellation?: ConstellationOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Background canvas animation ── */
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }

    if (!canvasRef.current) return;
    return startConstellation(canvasRef.current, constellation);
    // Options are fixed per page; restarting the animation on every render isn't wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Close the mobile menu with Escape ── */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.startsWith("/#") && pathname.startsWith(href);

  return (
    <>
      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.8rem;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-sizing: border-box;
        }
        .site-logo {
          display: flex;
          align-items: center;
          margin-left: 0.25rem;
        }
        .site-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .site-nav-link {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: rgba(200, 210, 230, 0.8);
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .site-nav-link:hover {
          color: #ffffff;
        }
        .site-nav-link.is-active {
          font-weight: 600;
          color: #3b82f6;
        }
        .site-register {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #ffffff;
          text-decoration: none;
          background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
          padding: 0.42rem 1.1rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: opacity 0.2s ease;
        }
        .site-register:hover {
          opacity: 0.85;
        }
        .site-menu-btn {
          display: none;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid rgba(96, 165, 250, 0.35);
          background: rgba(15, 23, 42, 0.6);
          color: #e2e8f0;
          cursor: pointer;
        }

        @media (max-width: 780px) {
          .site-header {
            padding: 0 1rem;
          }
          .site-menu-btn {
            display: flex;
          }
          /* links become a dropdown panel under the header */
          .site-nav {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: 0.5rem 1rem 1.25rem;
            background: rgba(2, 6, 23, 0.96);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(96, 165, 250, 0.2);
            transform: translateY(-8px);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          }
          .site-nav.is-open {
            transform: none;
            opacity: 1;
            visibility: visible;
          }
          .site-nav-link {
            font-size: 0.95rem;
            padding: 0.95rem 0.25rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }
          .site-register {
            margin-top: 1rem;
            justify-content: center;
            font-size: 0.9rem;
            padding: 0.85rem 1rem;
          }
        }
      `}</style>

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
      <header className="site-header">
        <Link href="/" className="site-logo" onClick={() => setMenuOpen(false)}>
          <Image src="/ieee-cs-logo.png" alt="IEEE Computer Society logo" width={38} height={38} priority />
        </Link>

        <button
          type="button"
          className="site-menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Navigation Items (current page active in blue) */}
        <nav id="site-nav" className={`site-nav${menuOpen ? " is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`site-nav-link${isActive(link.href) ? " is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link href="/events" className="site-register" onClick={() => setMenuOpen(false)}>
            REGISTER <span style={{ fontSize: "0.7rem", opacity: 0.9 }}>›</span>
          </Link>
        </nav>
      </header>

      {children}
    </>
  );
}
