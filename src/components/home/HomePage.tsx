"use client";

import { IEEE_CS_SOCIETY } from "@/lib/contants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Poster, { getEventStatus, EventStatus } from "./Poster";
import { EventFromBDBriefBreif } from "@/func/zodEventSchema";

const sections: { key: EventStatus; index: string; title: string; tagline: string; accent: string }[] = [
  { key: "ongoing", index: "01", title: "Ongoing Transmissions", tagline: "// live now on the grid", accent: "text-cyan" },
  { key: "upcoming", index: "02", title: "Upcoming Operations", tagline: "// registration window open", accent: "text-green-bright" },
  { key: "completed", index: "03", title: "Archived Ops", tagline: "// mission logs", accent: "text-muted" },
];

const marqueeItems = ["HACKATHONS", "CTF", "WORKSHOPS", "SECURITY BRIEFINGS", "BUG BASH", "CAPTURE THE FLAG", "ZERO DAYS", "CYBER MONTH 2026"];

export default function CyberSecurityEventShelf({ timelineEvents }: { timelineEvents: EventFromBDBriefBreif }) {

  const router = useRouter();

  const grouped: Record<EventStatus, typeof timelineEvents> = {
    upcoming: timelineEvents.filter((e) => getEventStatus(e.startDate, e.endDate) === "upcoming"),
    ongoing: timelineEvents.filter((e) => getEventStatus(e.startDate, e.endDate) === "ongoing"),
    completed: timelineEvents.filter((e) => getEventStatus(e.startDate, e.endDate) === "completed"),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border-green bg-black/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Image
            src={IEEE_CS_SOCIETY}
            alt="IEEE Computer Society Logo"
            width={42}
            height={42}
          />
          <h5 className="font-headings text-lg font-semibold tracking-tight text-white">
            BMSCE <span className="text-green-bright">IEEE COMPUTER SOCIETY</span>
          </h5>
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-border-green bg-green-bg px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-green-bright sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-green-bright" />
            System Online
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-[6vw] pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(50,255,136,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(50,255,136,0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/4 top-10 size-80 rounded-full bg-green-bright/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-24 size-80 rounded-full bg-cyan/10 blur-3xl" />

        <p className="font-mono text-xs uppercase tracking-[0.5em] text-green-bright">
          {"// breach the calendar"}
        </p>
        <h1 className="mt-4 font-headings text-[clamp(44px,9vw,120px)] font-bold leading-none tracking-tight text-white">
          <span className="drop-shadow-[0_0_25px_rgba(50,255,136,0.45)]">CYBER</span>{" "}
          <span className="text-green-bright drop-shadow-[4px_0_0_rgba(56,217,255,0.5)] drop-shadow-[-4px_0_0_rgba(255,77,94,0.4)]">
            MONTH
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          A full month of hackathons, CTFs, workshops and security briefings. Jack in, level up, and defend the grid.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3 font-mono text-[11px] uppercase tracking-widest">
          <span className="rounded-full border border-cyan/40 bg-cyan/10 px-5 py-2 text-cyan shadow-[0_0_18px_rgba(56,217,255,0.25)]">
            {grouped.ongoing.length} ongoing
          </span>
          <span className="rounded-full border border-green-bright/40 bg-green-bright/10 px-5 py-2 text-green-bright shadow-[0_0_18px_rgba(50,255,136,0.25)]">
            {grouped.upcoming.length} upcoming · registration open
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-muted">
            {grouped.completed.length} completed
          </span>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-border-green bg-black-2 py-3">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-10 font-headings text-sm font-semibold uppercase tracking-[0.4em] text-green-bright/70">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item} <span className="text-cyan">//</span>
            </span>
          ))}
        </div>
      </div>

      {/* Event sections */}
      <main id="events" className="relative mx-auto max-w-6xl px-[6vw] pb-24">
        {sections.map((section) => (
          <section key={section.key} className="mt-20">
            <div className="flex items-end gap-4 border-b border-border-green pb-4">
              <span className="font-headings text-7xl font-bold leading-none text-white/10">{section.index}</span>
              <div>
                <h2 className={`font-headings text-3xl font-bold tracking-tight ${section.accent}`}>
                  {section.title}
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-2">{section.tagline}</p>
              </div>
              <span className="ml-auto font-mono text-xs text-muted-2">[{grouped[section.key].length}]</span>
            </div>

            {grouped[section.key].length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-6">
                {grouped[section.key].map((event) => (
                  <Poster
                    key={event.eventID}
                    clickHandler={() => router.push(`/events/${event.eventSlug}`)}
                    event={event}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-2">
                {"// no events detected in this sector"}
              </p>
            )}
          </section>
        ))}

        {/* Timeline footer */}
        <div id="archive" className="mt-20 border-t border-border-green pt-6">
          <strong className="font-mono text-xs uppercase tracking-[0.3em] text-green-bright">Event Archive</strong>
          <p className="mt-2 text-sm text-muted">
            {timelineEvents.length} featured events · More coming soon...
          </p>
          <div className="mt-4 flex gap-8 overflow-x-auto pb-2">
            {timelineEvents.map((event) => (
              <div key={event.eventID} className="min-w-0 shrink-0">
                <div className="font-mono text-[11px] text-muted-2">
                  {event.startDate.toDateString()}
                </div>
                <div className="mt-1 text-[12px] text-white/80">
                  {event.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}
