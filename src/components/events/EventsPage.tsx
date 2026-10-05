"use client";

import Image from "next/image";
import Link from "next/link";

type EventFromBDBriefBreif = {
  paymentDetails: string;
  title: string;
  formLink: string;
  contactDetails: string;
  mode: "Offline" | "Online" | "Mixed";
  description: string;
  location: string;
  bannerLink: {
    fileId: string;
    name: string;
    size: number;
    versionInfo: { id: string; name: string } | null;
    filePath: string;
    url: string;
    fileType: string;
    height: number | null;
    width: number | null;
    thumbnailUrl: string | null;
    AITags: { name: string; confidence: number; source: string }[] | null;
    description: string | null;
    orientation?: number | null;
  };
  publish: boolean;
  startDate: Date;
  eventSlug: string;
  endDate: Date;
  eventID: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function EventsPage({ event }: { event: EventFromBDBriefBreif }) {
  return (
    <main className="event-page">
      <section className="event-hero">
        <Image
          className="event-banner"
          src={event.bannerLink.url}
          alt={`${event.title} event banner`}
          width={event.bannerLink.width || 1400}
          height={event.bannerLink.height || 800}
          priority
        />
        <div className="event-banner-shade" />
        <div className="event-hero-content">
          <Link href="/#events" className="event-back-link">← BACK TO EVENT ARCHIVE</Link>
          <div className="event-status-line"><span>MISSION {event.eventID.padStart(2, "0")}</span><i />{event.mode} EVENT</div>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </div>
        <div className="event-index-mark">BMSCE / IEEE CS <span>CYBER MONTH 2026</span></div>
      </section>

      <section className="event-brief-section">
        <div className="event-brief-layout">
          <div className="event-brief-main">
            <div className="event-section-label"><span>01</span><i />MISSION BRIEF</div>
            <h2>Enter the <span>mission.</span></h2>
            <p className="event-description">{event.description}</p>
            <p className="event-context">Join the BMSCE IEEE Computer Society community as we explore cybersecurity, technology and the challenges shaping our digital future.</p>

            <div className="event-parameters">
              <div className="event-parameters-title">MISSION_PARAMETERS <span>/ {event.eventID}</span></div>
              {[
                ["START", `${formatDate(event.startDate)} / ${formatTime(event.startDate)}`],
                ["END", `${formatDate(event.endDate)} / ${formatTime(event.endDate)}`],
                ["MODE", event.mode],
                ["LOCATION", event.location || "Online"],
                ["ACCESS", event.paymentDetails || "See registration details"],
              ].map(([label, value]) => (
                <div className="event-parameter" key={label}><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
          </div>

          <aside className="event-registration">
            <div className="event-section-label"><span>02</span><i />ACCESS / REGISTRATION</div>
            <div className="event-open-status"><i />REGISTRATION DETAILS</div>
            <p>Review the mission parameters, then continue to the event registration form.</p>
            <a className="event-register-button" href={event.formLink} target="_blank" rel="noreferrer">
              REGISTER FOR EVENT <span aria-hidden="true">↗</span>
            </a>
            <div className="event-contact"><span>CONTACT</span><p>{event.contactDetails || "Contact the society for details."}</p></div>
            <div className="event-access"><span>ACCESS</span><p>{event.paymentDetails || "See registration form."}</p></div>
          </aside>
        </div>
      </section>

      <footer className="event-footer"><Link href="/#hero">BMSCE IEEE COMPUTER SOCIETY</Link><span>CYBER MONTH / 2026</span><Link href="/#events">RETURN TO ARCHIVE ↑</Link></footer>

      <style jsx>{`
        .event-page { min-height: 100vh; overflow: hidden; padding-top: 78px; background: #030508; color: #e8eef1; }
        .event-hero { position: relative; display: flex; min-height: min(720px, 78svh); align-items: end; overflow: hidden; border-bottom: 1px solid rgba(0,191,255,.2); padding: 90px max(7vw, calc((100vw - 1200px) / 2)); }
        .event-banner { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.68) contrast(1.08); }
        .event-banner-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(3,5,8,.96), rgba(3,5,8,.75) 48%, rgba(3,5,8,.18)), linear-gradient(0deg, #030508, transparent 55%); }
        .event-hero-content { position: relative; z-index: 2; width: min(850px, 100%); }
        .event-back-link, .event-status-line, .event-index-mark, .event-section-label, .event-parameters-title, .event-parameter, .event-open-status, .event-contact > span, .event-access > span, .event-footer { font-family: var(--mono), monospace; text-transform: uppercase; }
        .event-back-link { display: inline-flex; margin-bottom: 34px; color: #8e9ba4; font-size: 8px; letter-spacing: .15em; transition: color .2s ease; }
        .event-back-link:hover { color: #00bfff; }
        .event-status-line { display: flex; align-items: center; gap: 11px; color: #00bfff; font-size: 8px; letter-spacing: .15em; }
        .event-status-line span { color: #d6a84f; }.event-status-line i { width: 24px; height: 1px; background: #d6a84f; }
        .event-hero h1 { max-width: 900px; margin: 22px 0; color: #e8eef1; font: 700 clamp(48px, 8vw, 104px)/.9 var(--font-chakrapetch), sans-serif; letter-spacing: .015em; text-shadow: 2px 0 rgba(0,191,255,.16); }
        .event-hero-content > p { max-width: 650px; margin: 0; color: #c0b7c6; font-size: 14px; line-height: 1.85; }
        .event-index-mark { position: absolute; z-index: 2; right: 7vw; bottom: 30px; display: grid; gap: 6px; color: #8d98a0; font-size: 7px; letter-spacing: .12em; text-align: right; }.event-index-mark span { color: #00bfff; }
        .event-brief-section { padding: 85px 7vw 110px; }
        .event-brief-layout { display: grid; width: min(100%, 1150px); grid-template-columns: minmax(0, 1fr) 310px; gap: 75px; margin: 0 auto; }
        .event-section-label { display: flex; align-items: center; gap: 11px; color: #a8b4bb; font-size: 8px; letter-spacing: .15em; }.event-section-label span { color: #d6a84f; }.event-section-label i { width: 28px; height: 1px; background: #00bfff; }
        .event-brief-main h2 { margin: 34px 0 20px; font: 600 clamp(40px, 5vw, 64px)/.95 var(--font-chakrapetch), sans-serif; }.event-brief-main h2 span { color: #d6a84f; }
        .event-description, .event-context { max-width: 720px; color: #b0a7b6; font-size: 14px; line-height: 1.9; }.event-context { color: #888091; }
        .event-parameters { margin-top: 38px; border: 1px solid rgba(0,191,255,.2); background: rgba(8,12,17,.86); padding: 0 21px; }
        .event-parameters-title { border-bottom: 1px solid rgba(0,191,255,.15); padding: 16px 0; color: #00bfff; font-size: 8px; letter-spacing: .12em; }.event-parameters-title span { color: #84929a; }
        .event-parameter { display: grid; grid-template-columns: 85px 1fr; gap: 14px; border-bottom: 1px solid rgba(255,255,255,.055); padding: 15px 0; font-size: 8px; letter-spacing: .05em; }.event-parameter:last-child { border-bottom: 0; }.event-parameter > span { color: #817889; }.event-parameter strong { color: #ddd5e2; font-weight: 400; line-height: 1.7; }
        .event-registration { align-self: start; border: 1px solid rgba(214,168,79,.25); background: linear-gradient(145deg, rgba(11,17,23,.94), rgba(4,7,11,.96)); padding: 22px; box-shadow: 4px 4px 0 rgba(0,191,255,.035); }
        .event-open-status { display: flex; align-items: center; gap: 9px; margin: 27px 0 13px; color: #00bfff; font-size: 8px; letter-spacing: .12em; }.event-open-status i { width: 6px; height: 6px; border-radius: 50%; background: #00bfff; box-shadow: 0 0 9px rgba(0,191,255,.65); }
        .event-registration > p { color: #9d94a4; font-size: 11px; line-height: 1.8; }
        .event-register-button { display: flex; min-height: 48px; align-items: center; justify-content: space-between; margin-top: 22px; border: 1px solid rgba(0,191,255,.58); padding: 0 15px; color: #7fe3ff; font: 8px var(--mono), monospace; letter-spacing: .08em; transition: background .2s ease, box-shadow .2s ease; }.event-register-button:hover, .event-register-button:focus-visible { outline: 2px solid rgba(214,168,79,.7); outline-offset: 3px; background: rgba(0,191,255,.07); box-shadow: 0 0 18px rgba(0,191,255,.12); }.event-register-button span { color: #d6a84f; font-size: 15px; }
        .event-contact, .event-access { margin-top: 22px; border-top: 1px solid rgba(255,255,255,.08); padding-top: 17px; }.event-contact > span, .event-access > span { color: #00bfff; font-size: 7px; letter-spacing: .14em; }.event-contact p, .event-access p { margin: 8px 0 0; color: #b2bdc3; font-size: 10px; line-height: 1.7; overflow-wrap: anywhere; }.event-access p { color: #d6a84f; }
        .event-footer { display: flex; justify-content: space-between; gap: 18px; border-top: 1px solid rgba(0,191,255,.15); padding: 21px 7vw; color: #929ea5; font-size: 7px; letter-spacing: .12em; }.event-footer a:first-child { color: #e5ebee; }.event-footer a:hover { color: #00bfff; }
        @media (max-width: 760px) { .event-page { padding-top: 68px; }.event-hero { min-height: 590px; padding: 60px 7vw 75px; }.event-banner-shade { background: linear-gradient(90deg, rgba(7,5,11,.88), rgba(7,5,11,.52)), linear-gradient(0deg, #08060d, transparent 70%); }.event-brief-section { padding: 66px 7vw 80px; }.event-brief-layout { grid-template-columns: 1fr; gap: 38px; }.event-registration { max-width: 500px; }.event-index-mark { right: 7vw; bottom: 20px; font-size: 6px; } }
        @media (max-width: 480px) { .event-hero { min-height: 560px; }.event-hero h1 { font-size: 48px; }.event-parameter { grid-template-columns: 65px 1fr; }.event-footer { flex-wrap: wrap; justify-content: center; text-align: center; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}
