"use client";

import Image from "next/image";
import SiteChrome from "@/components/site/SiteChrome";

/* ─── Timeline Page Component ───────────────────────────────────────────────── */
export default function TimelinePage() {


  return (
    <SiteChrome>

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
            fontFamily: "var(--font-heading), 'Space Grotesk', system-ui, sans-serif",
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
    </SiteChrome>
  );
}
