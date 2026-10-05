"use client";

import { useEffect, useState } from "react";
import type { EventFromBDBriefBreif } from "@/func/zodEventSchema";
import EventsGrid from "./EventsGrid";
import CyberIntro from "./CyberIntro";
import CircuitBackground from "../CircuitBackground";

const terminalMessages = [
  "initializing event intelligence...",
  "challenge matrix verified...",
  "attack surface monitored...",
  "encryption layer active...",
  "system ready_",
];
const missionFiles = [
  ["01", "LEARN", "Understand security, privacy and the systems shaping our digital lives."],
  ["02", "BUILD", "Turn curiosity into tools, projects and useful solutions."],
  ["03", "CHALLENGE", "Test assumptions, find weaknesses and think differently."],
  ["04", "TEACH", "Take digital safety beyond campus and into classrooms."],
];

function SectionMarker({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-marker"><span>{number}</span><i />{children}</div>;
}

export default function HomeMainPage({
  timelineEvents,
}: {
  timelineEvents: EventFromBDBriefBreif;
}) {
  const [showIntro, setShowIntro] = useState(true);
  const [terminalLines, setTerminalLines] = useState(terminalMessages.slice(0, 3));

  useEffect(() => {
    const interval = window.setInterval(() => {
      const message = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
      setTerminalLines((lines) => [...lines.slice(-5), message]);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".cyber-home .content-section, .cyber-home .impact-section, .cyber-home .final-section",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    sections.forEach((section) => {
      section.classList.add("section-pending");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cyber-site">
      {showIntro && <CyberIntro onComplete={() => setShowIntro(false)} />}
      <CircuitBackground />
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />

      <main className="cyber-home">
        <section id="hero" className="home-hero">
          <div className="hero-orbit hero-orbit-outer" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-inner" aria-hidden="true" />
          <svg className="hero-shield" viewBox="0 0 640 720" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="shield-stroke" x1="100" y1="80" x2="540" y2="650" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00BFFF" stopOpacity=".78" />
                <stop offset=".52" stopColor="#D6A84F" stopOpacity=".42" />
                <stop offset="1" stopColor="#008CFF" stopOpacity=".48" />
              </linearGradient>
              <radialGradient id="shield-fill" cx="0" cy="0" r="1" gradientTransform="matrix(0 370 -320 0 320 40)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0873A5" stopOpacity=".12" />
                <stop offset="1" stopColor="#030508" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="shield-scan-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#00BFFF" stopOpacity="0" />
                <stop offset=".5" stopColor="#00D9FF" stopOpacity=".68" />
                <stop offset="1" stopColor="#F0C96A" stopOpacity="0" />
              </linearGradient>
              <clipPath id="shield-clip">
                <path d="M320 48 524 125v184c0 163-91 286-204 357C207 595 116 472 116 309V125L320 48Z" />
              </clipPath>
            </defs>
            <g className="shield-radial-system">
              <circle cx="320" cy="350" r="292" stroke="#00BFFF" strokeOpacity=".13" />
              <circle cx="320" cy="350" r="270" stroke="#D6A84F" strokeOpacity=".14" strokeDasharray="2 12" />
              <circle cx="320" cy="350" r="238" stroke="#00BFFF" strokeOpacity=".13" strokeDasharray="88 14 4 14" />
              <path d="M320 42v35M320 623v45M80 350h42M518 350h42M151 181l29 29m280 280 29 29m0-338-29 29m-280 280-29 29" stroke="#D6A84F" strokeOpacity=".32" />
            </g>
            <path d="M320 48 524 125v184c0 163-91 286-204 357C207 595 116 472 116 309V125L320 48Z" fill="url(#shield-fill)" stroke="url(#shield-stroke)" strokeWidth="1.5" />
            <path d="M320 83 492 148v160c0 137-73 239-172 305-99-66-172-168-172-305V148l172-65Z" stroke="#00BFFF" strokeOpacity=".3" strokeWidth=".8" />
            <g clipPath="url(#shield-clip)" stroke="#00BFFF" strokeOpacity=".29" strokeWidth="1">
              <path d="M128 214h80l28 28h65m211-16h-82l-36 36h-45M116 408h117l38-38h48m205 60H408l-38-38h-55M177 515h72l32-32h39m143 57h-72l-32-32h-39" />
              <path d="M208 242v-38m304 204h-38m-312 67h39m215-197v-52m-138 272h-45m177 95v-58" stroke="#D6A84F" strokeOpacity=".4" />
              <circle cx="208" cy="204" r="3" fill="#D6A84F" stroke="none" />
              <circle cx="474" cy="452" r="3" fill="#00BFFF" stroke="none" />
              <circle cx="233" cy="475" r="2.5" fill="#00BFFF" stroke="none" />
              <circle cx="370" cy="307" r="2.5" fill="#D6A84F" stroke="none" />
            </g>
            <g className="shield-scan">
              <path d="M148 330h344" stroke="url(#shield-scan-gradient)" strokeWidth="2" />
              <path d="M200 334h240" stroke="#00D9FF" strokeOpacity=".12" strokeWidth="8" />
            </g>
            <path d="M320 245 384 270v59c0 49-27 87-64 112-37-25-64-63-64-112v-59l64-25Z" stroke="#D6A84F" strokeOpacity=".55" strokeWidth="1.5" />
            <path d="m294 328 18 18 36-40" stroke="#00D9FF" strokeOpacity=".72" strokeWidth="2" />
            <g fill="#9BB7C4" fillOpacity=".55" fontFamily="monospace" fontSize="8" letterSpacing="1.4">
              <text x="99" y="350" transform="rotate(-90 99 350)">DEFENSE GRID / 01</text>
              <text x="446" y="581">INTEGRITY 99.8</text>
              <text x="380" y="110">NODE / ACTIVE</text>
              <text x="175" y="607">BMSCE // CS SOCIETY</text>
            </g>
          </svg>
          <div className="hero-content">
            <div className="eyebrow"><span className="signal-dot" />BMSCE IEEE COMPUTER SOCIETY <span className="eyebrow-divider">/</span> 2026</div>
            <div className={`title-hologram${showIntro ? "" : " title-settled"}`}>
              <h1 className="home-title title-face title-face-front"><span>CYBER</span><span className="title-accent">MONTH</span></h1>
              <div className="home-title title-face title-face-back" aria-hidden="true"><span>CYBER</span><span className="title-accent">MONTH</span></div>
            </div>
            <p className="hero-lede">A month of cybersecurity, technology, challenges and learning.</p>
            <div className="hero-actions">
              <a className="cyber-button cyber-button-primary" href="#events">EXPLORE EVENTS <span aria-hidden="true">→</span></a>
              <a className="cyber-text-link" href="#about">MEET THE SOCIETY <span aria-hidden="true">↘</span></a>
            </div>
          </div>
          <div className="hero-coordinate" aria-hidden="true"><span>INTELLIGENCE NETWORK</span><b>ACTIVE</b><span>12.9716° N / 77.5946° E</span></div>
          <a href="#identity" className="scroll-cue"><span />SCROLL TO EXPLORE</a>
        </section>

        <section id="identity" className="content-section identity-section">
          <div className="section-wrap">
            <SectionMarker number="01">DIGITAL IDENTITY</SectionMarker>
            <div className="identity-layout">
              <div>
                <h2 className="display-heading">Your data is<br />your <span>digital self.</span></h2>
                <p className="body-copy identity-copy">Every click leaves a trace. Every account creates a footprint. Cybersecurity begins with understanding what is at risk, and what is worth protecting.</p>
                <a className="inline-link" href="#about">KNOW YOUR EXPOSURE <span aria-hidden="true">→</span></a>
              </div>
              <div className="identity-file">
                <div className="file-topline"><span>IDENTITY_RECORD / 08F31</span><span className="risk-status"><i />EXPOSED</span></div>
                <div className="file-name">CLASSIFIED PROFILE <span>LEVEL 03</span></div>
                {[ ["NAME", "████ ██████"], ["EMAIL", "u••••@secure.net"], ["LOCATION", "BENGALURU / IN"], ["CREDENTIALS", "ENCRYPTED // VERIFIED"] ].map(([key, value]) => (
                  <div className="file-row" key={key}><span>{key}</span><strong>{value}</strong></div>
                ))}
                <div className="file-stamp">DIGITAL FOOTPRINT / UNDER REVIEW</div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="content-section society-section">
          <div className="section-wrap">
            <SectionMarker number="02">THE SOCIETY</SectionMarker>
            <div className="society-intro">
              <h2 className="display-heading">WE DON&apos;T JUST<br /><span>USE TECHNOLOGY.</span></h2>
              <div className="body-copy society-copy">
                <p><strong>BMSCE IEEE Computer Society</strong> is a community of students, creators and technology enthusiasts exploring the future of computing.</p>
                <p>Cyber Month takes that curiosity beyond the classroom through experiences that teach, challenge and inspire.</p>
              </div>
            </div>
            <div className="mission-grid">
              {missionFiles.map(([number, title, description]) => (
                <article className="mission-file" key={number}>
                  <div className="mission-code">FILE / {number}</div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="mission-corner" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="content-section events-section">
          <div className="section-wrap">
            <div className="events-heading">
              <div><SectionMarker number="03">EVENT INTELLIGENCE</SectionMarker><h2 className="display-heading">MISSIONS<br /><span>IN MOTION.</span></h2></div>
              <p className="body-copy">Workshops, cyber challenges, technical talks, competitions and outreach. Select a mission to open its full briefing.</p>
            </div>
            <div className="archive-status"><span>LIVE ARCHIVE</span><span>{String(timelineEvents.length).padStart(2, "0")} RECORDS</span><span>ACCESS LEVEL / PUBLIC</span></div>
            <EventsGrid timelineEvents={timelineEvents} />
          </div>
        </section>

        <section id="hackathon" className="content-section main-event-section">
          <div className="section-wrap main-event-layout">
            <div><SectionMarker number="04">FLAGSHIP / HACKATHON</SectionMarker><h2 className="display-heading event-mantra">BUILD.<br />BREAK.<br /><span>DEFEND.</span></h2></div>
            <div className="main-event-copy">
              <p className="body-copy"><strong>Cyber Month Hackathon</strong> is where ideas meet pressure. Find a problem, build something useful, work with a team and defend your idea.</p>
              <div className="terminal-panel">
                <div className="terminal-heading"><span className="terminal-lights"><i /><i /><i /></span><span>CYBER-MONTH / ROOT TERMINAL</span><span>SECURE</span></div>
                <div className="terminal-body">
                  <div><span className="terminal-prompt">root@cybermonth</span>:~$ initialize --secure</div>
                  {terminalLines.map((line, index) => <div key={`${line}-${index}`}>&gt; {line}</div>)}
                  <div>&gt; cryptographic layer: <b>ACTIVE</b></div>
                  <div className="terminal-ready">&gt; SYSTEM READY<span className="terminal-cursor">_</span></div>
                </div>
              </div>
              <div className="event-specs"><div><strong>24H</strong><span>BUILD WINDOW</span></div><div><strong>∞</strong><span>WAYS TO SOLVE</span></div></div>
            </div>
          </div>
        </section>

        <section id="schools" className="content-section outreach-section">
          <div className="section-wrap outreach-layout">
            <div><SectionMarker number="05">BEYOND CAMPUS</SectionMarker><h2 className="display-heading outreach-heading">START<br /><span>EARLY.</span><br />STAY SAFE.</h2></div>
            <div><p className="body-copy">Cybersecurity shouldn&apos;t begin after someone gets hacked. We take digital safety into classrooms, helping students understand passwords, phishing, privacy, AI and the digital world around them.</p>
              <div className="mission-log"><div>OUTREACH_PROTOCOL <span>/ MISSION LOG</span></div><p>&gt; CONNECTING_TO_CLASSROOM...</p><p>&gt; DIGITAL_SAFETY_MODULE: LOADED</p><p>&gt; KNOWLEDGE_TRANSFER: ACTIVE</p><p>&gt; STATUS: <strong>MISSION_ACCEPTED</strong></p></div>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="section-wrap"><SectionMarker number="06">THE SIGNAL</SectionMarker><div className="impact-grid">
            {[["17+", "EVENTS"], ["3+", "SCHOOLS"], ["500+", "PEOPLE REACHED"], ["01", "COMMUNITY"]].map(([value, label]) => <div className="impact-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div></div>
        </section>

        <section id="contact" className="final-section">
          <div className="final-rings" aria-hidden="true" />
          <SectionMarker number="07">CONNECTION OPEN</SectionMarker>
          <h2>ENTER THE<br /><span>CYBER GRID.</span></h2>
          <p>Learn something new. Build something meaningful. Protect something important.</p>
          <a className="cyber-button cyber-button-primary" href="#events">ENTER CYBER MONTH <span aria-hidden="true">→</span></a>
        </section>
      </main>

      <footer className="cyber-footer"><a href="#hero">BMSCE IEEE COMPUTER SOCIETY</a><span>CYBER MONTH / 2026</span><span className="footer-status"><i /> NETWORK ONLINE</span></footer>
    </div>
  );
}
