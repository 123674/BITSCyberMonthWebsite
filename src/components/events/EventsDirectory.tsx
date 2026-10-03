"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReveal } from "@/components/site/useReveal";

import type { EventCardData } from "@/lib/eventCards";

export type { EventCardData };

const STATUS_SECTIONS: { type: EventCardData["eventType"]; heading: string }[] = [
  { type: "Upcomming", heading: "Upcoming Events" },
  { type: "OnGoing", heading: "Ongoing Events" },
  { type: "Completed", heading: "Past Events" },
];

const STATUS_LABEL: Record<EventCardData["eventType"], string> = {
  Upcomming: "Upcoming",
  OnGoing: "Ongoing",
  Completed: "Completed",
};

const isHackathon = (event: EventCardData) => /hack/i.test(event.title);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

function EventCard({ event, index = 0, onLoad = false }: { event: EventCardData; index?: number; onLoad?: boolean }) {
  return (
    <Link href={`/events/${event.eventSlug}`} className={`ev-card ${onLoad ? "reveal-onload" : "reveal"}`} style={{ animationDelay: `${(onLoad ? 360 : 0) + (index % 3) * 110}ms` }}>
      <div className="ev-card-banner">
        {event.bannerUrl ? (
          <Image src={event.bannerUrl} alt={event.title} fill sizes="(max-width: 700px) 100vw, 360px" style={{ objectFit: "cover" }} />
        ) : (
          <span className="ev-card-banner-fallback">{event.title.charAt(0)}</span>
        )}
      </div>
      <div className="ev-card-body">
        <div className="ev-card-tags">
          <span className={`ev-tag ev-tag-${event.eventType}`}>{STATUS_LABEL[event.eventType]}</span>
          <span className="ev-tag">{event.mode}</span>
        </div>
        <h3>{event.title}</h3>
        <p suppressHydrationWarning>{formatDate(event.startDate)}</p>
      </div>
    </Link>
  );
}

export default function EventsDirectory({ events }: { events: EventCardData[] }) {
  const [query, setQuery] = useState("");
  useReveal([query]);

  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const hackathons = sorted.filter(isHackathon);
  const q = query.trim().toLowerCase();
  const matches = sorted.filter((e) => !q || e.title.toLowerCase().includes(q));

  return (
    <main className="ev-page">
      <style>{`
        .ev-page {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 1.5rem 5rem;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: rgba(220, 228, 245, 0.88);
        }
        .ev-title {
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 0.75rem;
          background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.4));
        }
        .ev-subtitle {
          text-align: center;
          font-size: 1.05rem;
          color: rgba(200, 210, 230, 0.75);
          margin: 0 0 3rem;
        }
        .ev-hack {
          position: relative;
          border-radius: 20px;
          padding: 2.25rem;
          margin-bottom: 3.5rem;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(147, 51, 234, 0.18) 100%);
          border: 1px solid rgba(168, 85, 247, 0.35);
          box-shadow: 0 0 60px rgba(99, 102, 241, 0.15);
          backdrop-filter: blur(8px);
        }
        .ev-hack-eyebrow {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #93c5fd;
          margin: 0 0 0.5rem;
        }
        .ev-hack h2 {
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: clamp(1.6rem, 3.4vw, 2.4rem);
          font-weight: 800;
          text-transform: uppercase;
          margin: 0 0 1rem;
          color: #f1f5f9;
        }
        .ev-hack-text {
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 760px;
          margin: 0 0 1.5rem;
        }
        .ev-hack-empty {
          display: inline-block;
          padding: 0.6rem 1.1rem;
          border-radius: 10px;
          border: 1px dashed rgba(147, 197, 253, 0.45);
          color: #bfdbfe;
          font-weight: 600;
        }
        .ev-heading {
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e2e8f0;
          margin: 2.75rem 0 1.25rem;
        }
        .ev-search {
          width: 100%;
          box-sizing: border-box;
          padding: 0.85rem 1.1rem;
          border-radius: 12px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          background: rgba(15, 23, 42, 0.7);
          color: #e2e8f0;
          font: inherit;
          font-size: 1rem;
          outline: none;
        }
        .ev-search:focus {
          border-color: rgba(168, 85, 247, 0.7);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
          gap: 1.25rem;
        }
        .ev-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(96, 165, 250, 0.22);
          color: inherit;
          text-decoration: none;
          backdrop-filter: blur(6px);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ev-card:hover {
          border-color: rgba(168, 85, 247, 0.55);
          transform: translateY(-3px);
        }
        .ev-card-banner {
          position: relative;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ev-card-banner-fallback {
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.85);
        }
        .ev-card-body {
          padding: 1.1rem 1.25rem 1.3rem;
        }
        .ev-card-body h3 {
          margin: 0.6rem 0 0.35rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
        }
        .ev-card-body p {
          margin: 0;
          font-size: 0.92rem;
          color: rgba(200, 210, 230, 0.7);
        }
        .ev-card-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .ev-tag {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.35);
          color: rgba(203, 213, 225, 0.9);
        }
        .ev-tag-Upcomming { border-color: rgba(96, 165, 250, 0.6); color: #93c5fd; }
        .ev-tag-OnGoing { border-color: rgba(74, 222, 128, 0.6); color: #86efac; }
        .ev-tag-Completed { border-color: rgba(148, 163, 184, 0.4); color: #94a3b8; }
        @media (max-width: 480px) {
          .ev-hack {
            padding: 1.5rem 1.1rem;
          }
        }
        .ev-empty {
          color: rgba(200, 210, 230, 0.6);
          margin: 0;
        }
      `}</style>

      <h1 className="ev-title reveal-onload">Events</h1>
      <p className="ev-subtitle reveal-onload" style={{ animationDelay: "120ms" }}>Workshops, challenges and hands-on sessions from Cyber Month 2026.</p>

      {/* ── Hackathon ── */}
      <section id="hackathon" className="ev-hack reveal-onload" style={{ animationDelay: "240ms" }}>
        <p className="ev-hack-eyebrow">Flagship Event</p>
        <h2>Cyber Month Hackathon</h2>
        <p className="ev-hack-text">
          Team up, take on real-world cybersecurity problem statements, and build solutions
          against the clock. The hackathon is the centrepiece of Cyber Month 2026 — a chance to
          put your skills to the test, learn from mentors, and showcase what you can build.
        </p>
        {hackathons.length > 0 ? (
          <div className="ev-grid">
            {hackathons.map((event, i) => (
              <EventCard key={event.eventID} event={event} index={i} onLoad />
            ))}
          </div>
        ) : (
          <span className="ev-hack-empty">Details and registration coming soon</span>
        )}
      </section>

      {/* ── All events ── */}
      <input
        type="search"
        className="ev-search reveal-onload"
        style={{ animationDelay: "320ms" }}
        placeholder="Search events…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search events"
      />

      {events.length === 0 ? (
        <>
          <h2 className="ev-heading">All Events</h2>
          <p className="ev-empty">No events have been published yet. Check back soon!</p>
        </>
      ) : matches.length === 0 ? (
        <>
          <h2 className="ev-heading">All Events</h2>
          <p className="ev-empty">No events match “{query}”.</p>
        </>
      ) : (
        STATUS_SECTIONS.map(({ type, heading }) => {
          const list = matches.filter((e) => e.eventType === type);
          if (list.length === 0) return null;
          return (
            <div key={type}>
              <h2 className="ev-heading reveal">{heading}</h2>
              <div className="ev-grid">
                {list.map((event, i) => (
                  <EventCard key={event.eventID} event={event} index={i} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
