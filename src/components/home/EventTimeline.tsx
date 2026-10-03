import Link from "next/link";
import type { EventCardData } from "@/lib/eventCards";

const STATUS_LABEL: Record<EventCardData["eventType"], string> = {
  Upcomming: "Upcoming",
  OnGoing: "Ongoing",
  Completed: "Completed",
};

const IST = "Asia/Kolkata";
const dayOf = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", timeZone: IST });
const monthOf = (iso: string) => new Date(iso).toLocaleString("en-IN", { month: "short", timeZone: IST }).toUpperCase();
const timeOf = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "long", hour: "numeric", minute: "2-digit", timeZone: IST });

export default function EventTimeline({ events }: { events: EventCardData[] }) {
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <section id="timeline" className="tl-section">
      <style>{`
        .tl-section {
          scroll-margin-top: 64px;
          max-width: 1000px;
          margin: 0 auto;
          padding: 5rem 1.5rem 6rem;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: rgba(220, 228, 245, 0.88);
        }
        .tl-eyebrow {
          text-align: center;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #93c5fd;
          margin: 0 0 0.6rem;
        }
        .tl-title {
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 3.5rem;
          background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 22px rgba(168, 85, 247, 0.35));
        }
        .tl-list {
          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        /* the glowing centre line */
        .tl-list::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(96, 165, 250, 0) 0%, #60a5fa 8%, #a855f7 92%, rgba(168, 85, 247, 0) 100%);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.6);
        }
        .tl-item {
          position: relative;
          width: 50%;
          box-sizing: border-box;
          padding: 0 2.75rem 2.75rem 0;
        }
        .tl-item:nth-child(even) {
          margin-left: 50%;
          padding: 0 0 2.75rem 2.75rem;
        }
        /* dot on the line */
        .tl-item::after {
          content: "";
          position: absolute;
          top: 1.6rem;
          right: -8px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #0b1120;
          border: 2px solid #a78bfa;
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15), 0 0 14px rgba(168, 85, 247, 0.7);
        }
        .tl-item:nth-child(even)::after {
          right: auto;
          left: -8px;
        }
        .tl-item.is-past::after {
          border-color: #64748b;
          box-shadow: none;
        }
        .tl-card {
          display: flex;
          gap: 1.1rem;
          align-items: flex-start;
          padding: 1.25rem 1.35rem;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(96, 165, 250, 0.22);
          backdrop-filter: blur(6px);
          color: inherit;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .tl-card:hover {
          border-color: rgba(168, 85, 247, 0.55);
          transform: translateY(-3px);
        }
        .tl-item.is-past .tl-card {
          opacity: 0.6;
        }
        .tl-date {
          flex: 0 0 auto;
          width: 64px;
          padding: 0.5rem 0;
          border-radius: 10px;
          text-align: center;
          background: linear-gradient(160deg, rgba(37, 99, 235, 0.35) 0%, rgba(147, 51, 234, 0.35) 100%);
          border: 1px solid rgba(168, 85, 247, 0.35);
        }
        .tl-day {
          display: block;
          font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1;
          color: #f1f5f9;
        }
        .tl-month {
          display: block;
          margin-top: 0.2rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #c4b5fd;
        }
        .tl-body h3 {
          margin: 0 0 0.3rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
        }
        .tl-time {
          margin: 0 0 0.65rem;
          font-size: 0.9rem;
          color: rgba(200, 210, 230, 0.7);
        }
        .tl-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .tl-tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.18rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.35);
          color: rgba(203, 213, 225, 0.9);
        }
        .tl-tag-Upcomming { border-color: rgba(96, 165, 250, 0.6); color: #93c5fd; }
        .tl-tag-OnGoing { border-color: rgba(74, 222, 128, 0.6); color: #86efac; }
        .tl-empty {
          text-align: center;
          color: rgba(200, 210, 230, 0.65);
          margin: 0;
        }
        .tl-all {
          display: block;
          width: max-content;
          margin: 1rem auto 0;
          padding: 0.65rem 1.4rem;
          border-radius: 999px;
          border: 1px solid rgba(96, 165, 250, 0.45);
          color: #e2e8f0;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .tl-all:hover {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
          border-color: rgba(168, 85, 247, 0.6);
        }

        /* phones: single column with the line on the left */
        @media (max-width: 720px) {
          .tl-list::before { left: 7px; transform: none; }
          .tl-item,
          .tl-item:nth-child(even) {
            width: 100%;
            margin-left: 0;
            padding: 0 0 2rem 2.25rem;
          }
          .tl-item::after,
          .tl-item:nth-child(even)::after {
            left: 0;
            right: auto;
          }
        }
      `}</style>

      <p className="tl-eyebrow reveal">October 2026</p>
      <h2 className="tl-title reveal" style={{ animationDelay: "100ms" }}>Event Timeline</h2>

      {sorted.length === 0 ? (
        <p className="tl-empty reveal">The event schedule will be announced soon.</p>
      ) : (
        <ol className="tl-list">
          {sorted.map((event) => (
            <li key={event.eventID} className={`tl-item reveal${event.eventType === "Completed" ? " is-past" : ""}`}>
              <Link href={`/events/${event.eventSlug}`} className="tl-card">
                <div className="tl-date" aria-hidden="true">
                  <span className="tl-day" suppressHydrationWarning>{dayOf(event.startDate)}</span>
                  <span className="tl-month" suppressHydrationWarning>{monthOf(event.startDate)}</span>
                </div>
                <div className="tl-body">
                  <h3>{event.title}</h3>
                  <p className="tl-time" suppressHydrationWarning>{timeOf(event.startDate)}</p>
                  <div className="tl-tags">
                    <span className={`tl-tag tl-tag-${event.eventType}`}>{STATUS_LABEL[event.eventType]}</span>
                    <span className="tl-tag">{event.mode}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <Link href="/events" className="tl-all reveal">View all events →</Link>
    </section>
  );
}
