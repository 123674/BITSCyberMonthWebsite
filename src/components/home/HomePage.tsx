"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { EventFromBDBriefBreif } from "@/func/zodEventSchema";
import { IEEE_CS_SOCIETY } from "@/lib/contants";
import ScrollTextReveal from "@/components/background/ScrollTextReveal";
import SpiralCarousel from "@/components/spiral-carousel/SpiralCarousel";
import styles from "./HomePage.module.css";

type Event = EventFromBDBriefBreif[number];
type MissionFilter = "all" | "offense" | "defense" | "code" | "ai" | "puzzles";
type EventStatus = "upcoming" | "ongoing" | "completed";

const missionFilters: { id: MissionFilter; label: string }[] = [
  { id: "all", label: "All missions" },
  { id: "offense", label: "Offense" },
  { id: "defense", label: "Defense" },
  { id: "code", label: "Code" },
  { id: "ai", label: "AI" },
  { id: "puzzles", label: "Puzzles" },
];

const missionKeywords: Record<Exclude<MissionFilter, "all">, string[]> = {
  offense: ["ctf", "capture the flag", "penetration", "offensive", "exploit", "red team", "hunt"],
  defense: ["defense", "defence", "blue team", "incident", "security", "forensic", "threat"],
  code: ["code", "coding", "program", "debug", "development", "hackathon"],
  ai: [" ai ", "artificial intelligence", "machine learning", " ml ", "neural"],
  puzzles: ["quiz", "puzzle", "treasure", "riddle", "challenge", "crypto"],
};

const journey = [
  { number: "01", title: "Registration", detail: "Find your mission and get ready to join." },
  { number: "02", title: "Opening", detail: "Meet the community and enter the cyber world." },
  { number: "03", title: "Technical events", detail: "Put practical skills to work." },
  { number: "04", title: "Workshops", detail: "Explore new tools and ideas hands-on." },
  { number: "05", title: "Challenges", detail: "Think critically. Solve together." },
  { number: "06", title: "Finale", detail: "Bring the month’s missions to a close." },
  { number: "07", title: "Awards", detail: "Celebrate the people behind the progress." },
];

const networkNodes = [
  { x: 100, y: 44, label: "01" },
  { x: 276, y: 20, label: "02" },
  { x: 432, y: 65, label: "03" },
  { x: 171, y: 151, label: "04" },
  { x: 351, y: 151, label: "05" },
  { x: 74, y: 254, label: "06" },
  { x: 256, y: 266, label: "07" },
  { x: 432, y: 253, label: "08" },
];

const networkEdges = [
  [0, 1], [0, 3], [1, 2], [1, 3], [1, 4], [2, 4],
  [3, 4], [3, 5], [3, 6], [4, 6], [4, 7], [5, 6], [6, 7],
];

// Splits a word into letters that animate in one after another.
function heroLetters(word: string, startIndex = 0) {
  return word.split("").map((letter, i) => (
    <span key={i} className={styles.heroLetter} style={{ "--i": startIndex + i } as CSSProperties} aria-hidden="true">
      {letter}
    </span>
  ));
}

function getStatus(event: Event): EventStatus {
  const now = Date.now();
  if (now < event.startDate.getTime()) return "upcoming";
  if (now <= event.endDate.getTime()) return "ongoing";
  return "completed";
}

function getEventCategories(event: Event): Exclude<MissionFilter, "all">[] {
  const text = ` ${event.title} ${event.description} `.toLowerCase();
  return (Object.keys(missionKeywords) as Exclude<MissionFilter, "all">[]).filter((category) =>
    missionKeywords[category].some((keyword) => text.includes(keyword)),
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(start: Date, end: Date): string {
  const hours = Math.max(0, Math.round((end.getTime() - start.getTime()) / 3_600_000));
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days} day${days === 1 ? "" : "s"}, ${remainingHours}h` : `${days} day${days === 1 ? "" : "s"}`;
}

function AnimatedCount({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = window.requestAnimationFrame(() => setCount(value));
      return () => window.cancelAnimationFrame(frame);
    }
    let startTime = 0;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min(1, (time - startTime) / 850);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{String(count).padStart(2, "0")}</>;
}

function NetworkGraphic() {
  return (
    <div className={styles.network} aria-label="Animated network visualization">
      <div className={styles.networkReadout}>
        <span><i /> NETWORK MAP</span>
        <span>ENCRYPTION ACTIVE</span>
      </div>
      <svg viewBox="0 0 500 310" role="img" aria-labelledby="network-title">
        <title id="network-title">A connected network of eight active nodes</title>
        <defs>
          <radialGradient id="network-glow">
            <stop stopColor="#b14dff" stopOpacity=".7" />
            <stop offset="1" stopColor="#b14dff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {networkEdges.map(([from, to]) => {
          const first = networkNodes[from];
          const second = networkNodes[to];
          return (
            <line
              key={`${from}-${to}`}
              x1={first.x}
              y1={first.y}
              x2={second.x}
              y2={second.y}
              className={styles.networkEdge}
            />
          );
        })}
        {networkEdges.slice(0, 7).map(([from, to], index) => {
          const first = networkNodes[from];
          const second = networkNodes[to];
          return (
            <circle key={`${from}-${to}-packet`} r="2.5" className={styles.packet}>
              <animateMotion
                dur={`${3.4 + (index % 4) * 0.6}s`}
                begin={`${index * 0.27}s`}
                repeatCount="indefinite"
                path={`M ${first.x} ${first.y} L ${second.x} ${second.y}`}
              />
            </circle>
          );
        })}
        {networkNodes.map((node, index) => (
          <g key={node.label} className={styles.networkNode} style={{ animationDelay: `${index * 0.12}s` }}>
            <circle cx={node.x} cy={node.y} r="16" fill="url(#network-glow)" />
            <circle cx={node.x} cy={node.y} r="4" className={styles.nodeCore} />
            <text x={node.x + 12} y={node.y - 12}>{node.label}</text>
          </g>
        ))}
        <circle cx="256" cy="151" r="58" className={styles.networkOrbit} />
        <circle cx="256" cy="151" r="72" className={styles.networkOrbitOuter} />
        <g className={styles.networkCenter}>
          <path d="M256 123 278 132v18c0 16-10 27-22 33-12-6-22-17-22-33v-18z" />
          <path d="M247 151l6 6 12-13" />
        </g>
      </svg>
      <div className={styles.networkFooter}>
        <span>THREAT DETECTION <b>● NOMINAL</b></span>
        <span>LATENCY <b>08ms</b></span>
      </div>
    </div>
  );
}

function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    let frame = 0;
    let point = { x: 0, y: 0 };

    const move = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
        frame = 0;
      });
      const target = event.target instanceof Element ? event.target : null;
      cursor.dataset.mode = target?.closest("[data-cursor='view']") ? "view" : target?.closest("a, button") ? "active" : "idle";
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true"><span>VIEW</span></div>;
}

export default function CyberSecurityEventShelf({
  timelineEvents,
  eventFeedAvailable,
}: {
  timelineEvents: EventFromBDBriefBreif;
  eventFeedAvailable: boolean;
}) {
  const [filter, setFilter] = useState<MissionFilter>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const journeyFillRef = useRef<HTMLSpanElement>(null);

  const grouped = useMemo(
    () => ({
      upcoming: timelineEvents.filter((event) => getStatus(event) === "upcoming"),
      ongoing: timelineEvents.filter((event) => getStatus(event) === "ongoing"),
      completed: timelineEvents.filter((event) => getStatus(event) === "completed"),
    }),
    [timelineEvents],
  );

  const filteredEvents = useMemo(() => {
    if (filter === "all") return timelineEvents;
    return timelineEvents.filter((event) => getEventCategories(event).includes(filter));
  }, [filter, timelineEvents]);

  useEffect(() => {
    const site = siteRef.current;
    site?.classList.add(styles.motionReady);
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          revealObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    site?.querySelectorAll(`.${styles.reveal}`).forEach((element) => revealObserver.observe(element));

    let eventPoint = { x: -1, y: -1 };
    const updateMagneticElements = () => {
      site?.querySelectorAll<HTMLElement>(".magnetic").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isHovered = eventPoint.x >= rect.left && eventPoint.x <= rect.right && eventPoint.y >= rect.top && eventPoint.y <= rect.bottom;
        if (isHovered && window.matchMedia("(pointer: fine)").matches) {
          element.style.setProperty("--mag-x", `${(eventPoint.x - rect.left - rect.width / 2) * 0.07}px`);
          element.style.setProperty("--mag-y", `${(eventPoint.y - rect.top - rect.height / 2) * 0.07}px`);
        } else {
          element.style.setProperty("--mag-x", "0px");
          element.style.setProperty("--mag-y", "0px");
        }
      });
    };
    const updateScroll = () => {
      setScrolled(window.scrollY > 24);
      const journeyElement = document.getElementById("journey");
      if (journeyElement) {
        const rect = journeyElement.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rect.top) / (rect.height * 0.72)));
        journeyFillRef.current?.style.setProperty("height", `${progress * 100}%`);
      }
      updateMagneticElements();
    };
    const trackPointer = (event: PointerEvent) => {
      eventPoint = { x: event.clientX, y: event.clientY };
      updateMagneticElements();
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    window.addEventListener("pointermove", trackPointer, { passive: true });
    updateScroll();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", trackPointer);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedEvent && dialog && !dialog.open) dialog.showModal();
    if (!selectedEvent && dialog?.open) dialog.close();
  }, [selectedEvent]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={siteRef} className={styles.site}>
      <CursorFollower />
      <ScrollTextReveal />
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.navWrap}>
          <Link className={styles.brand} href="#home" aria-label="Cyber Month home" onClick={closeMenu}>
            <Image src={IEEE_CS_SOCIETY} alt="IEEE Computer Society" width={38} height={38} />
            <span><b>BMSCE IEEE COMPUTER SOCIETY</b><small>CYBER MONTH</small></span>
          </Link>
          <button className={styles.menuToggle} type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span />
          </button>
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#events" onClick={closeMenu}>Events</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#journey" onClick={closeMenu}>Schedule</a>
            <a href="#team" onClick={closeMenu}>Team</a>
            <Link className={styles.navCta} href="/events" onClick={closeMenu}>Register <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} id="home">
          <div className={styles.heroGrid} />
          <div className={styles.heroGlow} />
          <div className={styles.heroBeam} />
          <span className={`${styles.coordinate} ${styles.coordinateTop}`}>12°56&apos;N&nbsp; 77°34&apos;E <i /> BENGALURU, IN</span>
          <span className={`${styles.coordinate} ${styles.coordinateSide}`}>CM / 2026<br />SYS.01.26</span>
          <div className={styles.heroContent}>
            <div className={`${styles.heroCopy} ${styles.reveal}`}>
              <p className={styles.eyebrow}><span className={styles.statusDot} /> A BMSCE IEEE COMPUTER SOCIETY INITIATIVE</p>
              <h1 aria-label="Cyber Month"><span className={styles.heroLine}>{heroLetters("CYBER")}</span><span className={`${styles.heroLine} ${styles.heroAccent}`}>{heroLetters("MONTH", 5)}<span className={`${styles.heroLetter} ${styles.heroPeriod}`} style={{ "--i": 10 } as CSSProperties} aria-hidden="true">.</span></span></h1>
              <p className={styles.heroSubtitle}>A TECHNICAL EVENT</p>
              <p className={styles.heroDescription}>Where technology meets curiosity, creativity and cybersecurity.</p>
              <div className={styles.heroActions}>
                <a className={`${styles.primaryButton} magnetic`} href="#events">Explore events <span aria-hidden="true">↗</span></a>
                <a className={styles.textButton} href="#about">About Cyber Month <span aria-hidden="true">↓</span></a>
              </div>
              <div className={styles.heroSignal}>
                <span><b>{String(timelineEvents.length).padStart(2, "0")}</b> LIVE EVENT LOGS</span>
                <span className={styles.signalDivider} />
                <span>EXPLORE. LEARN. SECURE.</span>
              </div>
            </div>
          </div>
          <a className={styles.scrollCue} href="#about"><span>SCROLL TO EXPLORE</span><i /></a>
          <div className={styles.heroBottom}>CYBER MONTH <span>2026</span><span className={styles.heroBottomLine} /> BMSCE, BENGALURU</div>
        </section>

        <section className={`${styles.about} ${styles.section}`} id="about">
          <div className={styles.sectionInner}>
            <div className={`${styles.aboutIntro} ${styles.reveal}`}>
              <p className={styles.eyebrow}><span>01</span> / THE IDEA</p>
              <h2>WHAT IS<br /><span>CYBER MONTH?</span></h2>
              <p className={styles.sectionLead}>A month of curiosity, collaboration and hands-on technology.</p>
            </div>
            <div className={`${styles.aboutContent} ${styles.reveal}`}>
              <NetworkGraphic />
              <p className={styles.aboutDescription}>Cyber Month is a technical event designed to bring students together through cybersecurity, technology, innovation, problem-solving and hands-on challenges.</p>
              <div className={styles.aboutMeta}><span>BUILT FOR THE CURIOUS</span><span>EST. 2026 <i /></span></div>
            </div>
          </div>
        </section>

        <section className={`${styles.spotlight} ${styles.section}`} id="spotlight">
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div><p className={styles.eyebrow}><span>{"//"}</span> / EVENT SPOTLIGHT</p><h2>THE CYBER <span>SPIRAL.</span></h2></div>
              <p>Drag or swipe to spin through the month.<br />Tap the front poster to find your event.</p>
            </div>
          </div>
          <SpiralCarousel
            className={styles.spiral}
            wheelAxis="horizontal"
            onSelect={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
          />
        </section>

        <section className={`${styles.events} ${styles.section}`} id="events">
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div><p className={styles.eyebrow}><span>02</span> / MISSION SELECT</p><h2>ENTER THE <span>CHALLENGE.</span></h2></div>
              <p>Pick a signal. Find your next challenge.<br />Every event opens a new way in.</p>
            </div>
            <div className={styles.eventOverview}>
              <div className={styles.eventStatus}><i /><span>{grouped.ongoing.length} LIVE</span><span className={styles.statusSeparator}>/</span><span>{grouped.upcoming.length} UPCOMING</span></div>
              <a href="#journey" className={styles.archiveLink}>VIEW THE JOURNEY <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.filterBar} role="group" aria-label="Filter events by mission type">
              {missionFilters.map((mission) => (
                <button key={mission.id} type="button" aria-pressed={filter === mission.id} onClick={() => setFilter(mission.id)}>{mission.label}<span>{mission.id === "all" ? timelineEvents.length : timelineEvents.filter((event) => getEventCategories(event).includes(mission.id as Exclude<MissionFilter, "all">)).length.toString().padStart(2, "0")}</span></button>
              ))}
            </div>
            <p className={styles.filterNote}>Mission filters match published event titles and descriptions.</p>
            {filteredEvents.length ? (
              <div className={styles.missionGrid} aria-live="polite">
                {filteredEvents.map((event, index) => {
                  const status = getStatus(event);
                  const categories = getEventCategories(event);
                  return (
                    <article key={event.eventID} className={`${styles.missionCard} ${styles.reveal}`} data-cursor="view" style={{ transitionDelay: `${Math.min(index % 3, 2) * 90}ms` }}>
                      <button className={styles.missionHitArea} type="button" onClick={() => setSelectedEvent(event)} aria-label={`View mission: ${event.title}`}>
                        <div className={styles.missionImage}>
                          <Image src={event.bannerLink.url} alt={`${event.title} event banner`} fill unoptimized sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                          <span className={`${styles.missionStatus} ${styles[`status_${status}`]}`}><i />{status === "ongoing" ? "Live now" : status === "upcoming" ? "Registration open" : "Completed"}</span>
                          <span className={styles.missionMode}>{event.mode}</span>
                          <span className={styles.missionNumber}>{String(index + 1).padStart(2, "0")} / {String(filteredEvents.length).padStart(2, "0")}</span>
                        </div>
                        <div className={styles.missionBody}>
                          <div className={styles.missionTags}>{categories.length ? categories.slice(0, 2).map((category) => <span key={category}>{category}</span>) : <span>CYBER MONTH</span>}</div>
                          <h3>{event.title}</h3>
                          <p>{event.description}</p>
                          <div className={styles.missionMeta}><span>{formatDate(event.startDate)}</span><span>{event.location}</span></div>
                          <span className={styles.missionLink}>View mission <b aria-hidden="true">↗</b></span>
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>{eventFeedAvailable ? "NO SIGNAL FOUND" : "EVENT FEED OFFLINE"}</span>
                <p>{eventFeedAvailable
                  ? "No published events match this mission type yet."
                  : "Connect PostgreSQL by setting DATABASE_URL in the project’s .env file, then restart the development server to load published events."}</p>
                {eventFeedAvailable && <button type="button" onClick={() => setFilter("all")}>View all missions ↗</button>}
              </div>
            )}
            <div className={styles.eventFooter}><span>SHOWING {filteredEvents.length.toString().padStart(2, "0")} OF {timelineEvents.length.toString().padStart(2, "0")} PUBLISHED EVENTS</span><Link href="/events">OPEN EVENT DIRECTORY <span aria-hidden="true">↗</span></Link></div>
          </div>
        </section>

        <section className={`${styles.journey} ${styles.section}`} id="journey">
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div><p className={styles.eyebrow}><span>03</span> / YOUR ROUTE</p><h2>THE CYBER <span>JOURNEY.</span></h2></div>
              <p>A route through discovery, practice<br />and the people you meet along the way.</p>
            </div>
            <div className={styles.journeyLayout}>
              <div className={styles.journeyTrack} aria-hidden="true"><span ref={journeyFillRef} /></div>
              <ol className={styles.journeyList}>
                {journey.map((step, index) => (
                  <li key={step.number} className={`${styles.journeyStep} ${styles.reveal}`} style={{ transitionDelay: `${(index % 4) * 70}ms` }}>
                    <span className={styles.journeyNumber}>{step.number}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div><span className={styles.journeyMark} aria-hidden="true">+</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={`${styles.missionSelect} ${styles.section}`}>
          <div className={styles.sectionInner}>
            <div className={`${styles.selectPanel} ${styles.reveal}`}>
              <div className={styles.selectCopy}><p className={styles.eyebrow}><span>04</span> / FIND YOUR ANGLE</p><h2>CHOOSE YOUR<br /><span>MISSION.</span></h2><p>Every curious mind has a starting point. Where will yours be?</p></div>
              <div className={styles.selectOptions} role="group" aria-label="Choose an event mission type">
                {missionFilters.filter((mission) => mission.id !== "all").map((mission, index) => {
                  const count = timelineEvents.filter((event) => getEventCategories(event).includes(mission.id as Exclude<MissionFilter, "all">)).length;
                  return <button key={mission.id} type="button" onClick={() => {
                    setFilter(mission.id);
                    document.getElementById("events")?.scrollIntoView({
                      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    });
                  }}><span>{String(index + 1).padStart(2, "0")}</span>{mission.label}<i>{count.toString().padStart(2, "0")} SIGNALS ↗</i></button>;
                })}
              </div>
              <div className={styles.selectOrb} aria-hidden="true"><span /><span /><span /></div>
            </div>
          </div>
        </section>

        <section className={`${styles.command} ${styles.section}`} id="command">
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div><p className={styles.eyebrow}><span>05</span> / SYSTEM OVERVIEW</p><h2>CYBER COMMAND <span>CENTER.</span></h2></div>
              <p>One shared space for bold ideas,<br />new skills and real connection.</p>
            </div>
            <div className={styles.commandPanel}>
              <div className={styles.commandTop}><span><i /> SYSTEM STATUS: ONLINE</span><span>CM // 2026</span></div>
              <div className={styles.commandGrid}>
                <div className={styles.commandVisual}><div className={styles.radar}><span /><span /><i /><b /></div><p>SCANNING FOR CURIOSITY</p></div>
                <div className={styles.stats}>
                  <div><span>EVENTS</span><b><AnimatedCount value={timelineEvents.length} /><small>+</small></b><i>Published missions</i></div>
                  <div><span>PARTICIPANTS</span><b>—</b><i>To be announced</i></div>
                  <div><span>CHALLENGES</span><b>—</b><i>To be announced</i></div>
                  <div><span>PRIZES</span><b>—</b><i>To be announced</i></div>
                </div>
              </div>
              <div className={styles.commandBottom}><span>ALL SYSTEMS NOMINAL</span><span>DATA UPDATES WITH EVENT ANNOUNCEMENTS</span></div>
            </div>
          </div>
        </section>

        <section className={`${styles.why} ${styles.section}`} id="why">
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div><p className={styles.eyebrow}><span>06</span> / WHY TAKE PART</p><h2>MORE THAN A <span>CHALLENGE.</span></h2></div>
              <p>Come for the technical challenge.<br />Leave with a little more than you came with.</p>
            </div>
            <div className={styles.whyGrid}>
              {[
                { number: "01", title: "LEARN", text: "Gain practical technical knowledge.", detail: "Explore ideas, tools and cybersecurity concepts through hands-on challenges and workshops.", glyph: "M12 3 2.8 8 12 13l9.2-5L12 3Zm-7.5 8.1V16L12 20l7.5-4v-4.9L12 15l-7.5-3.9Z" },
                { number: "02", title: "COMPETE", text: "Test your skills through challenging events.", detail: "Take on a new problem, find your approach and see what you can do when the clock is running.", glyph: "M8 4h8v3a4 4 0 0 1-8 0V4Zm0 2H4v1a4 4 0 0 0 4 4m8-5h4v1a4 4 0 0 1-4 4m-4 1v4m-4 4h8m-6-4h4" },
                { number: "03", title: "CONNECT", text: "Meet students, developers and technology enthusiasts.", detail: "Share ideas with a community that’s curious about the same things you are.", glyph: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 10v-2a4 4 0 0 0-3-3.9m-3-12a4 4 0 0 1 0 7.8" },
              ].map((item) => (
                <article className={styles.whyCard} key={item.title}>
                  <div className={styles.whyCardTop}><span>{item.number} / CYBER MONTH</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.glyph} /></svg></div>
                  <h3>{item.title}</h3><p>{item.text}</p><div className={styles.whyExtra}><p>{item.detail}</p><span>EXPLORE YOUR POTENTIAL ↗</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.register} id="register">
          <div className={styles.registerGrid} />
          <div className={styles.registerContent}>
            <p className={styles.eyebrow}><span>07</span> / YOUR NEXT MOVE</p>
            <h2>READY TO ENTER<br />THE <span>CYBER WORLD?</span></h2>
            <p>Your challenge begins here.</p>
            <Link className={`${styles.registerButton} magnetic`} href="/events">Register now <span aria-hidden="true">↗</span></Link>
            <span className={styles.registerNote}>CHOOSE YOUR EVENT · EXPLORE THE DETAILS · JOIN THE MISSION</span>
          </div>
          <div className={styles.registerOrbit} aria-hidden="true"><span /><span /></div>
        </section>
      </main>

      <footer className={styles.footer} id="team">
        <div className={styles.footerMain}>
          <Link className={styles.footerBrand} href="#home"><Image src={IEEE_CS_SOCIETY} alt="IEEE Computer Society" width={42} height={42} /><span><b>BMSCE IEEE COMPUTER SOCIETY</b><small>CYBER MONTH</small></span></Link>
          <p className={styles.footerMessage}>A technical event for<br />the next generation of thinkers.</p>
          <nav className={styles.footerLinks} aria-label="Footer navigation"><a href="#home">Home</a><a href="#events">Events</a><a href="#about">About</a><a href="#journey">Schedule</a><a href="#team">Team</a><Link href="/events">Contact</Link></nav>
          <div className={styles.footerStatus}><i /> SYSTEM STATUS: ONLINE</div>
        </div>
        <div className={styles.footerBottom}><span>© 2026 BMSCE IEEE COMPUTER SOCIETY</span><a href="#home">BACK TO TOP ↑</a><span>BUILT FOR THE CURIOUS.</span></div>
      </footer>

      <dialog ref={dialogRef} className={styles.missionDialog} onClose={() => setSelectedEvent(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
        {selectedEvent && (
          <div className={styles.dialogContent}>
            <button className={styles.dialogClose} type="button" aria-label="Close mission details" onClick={() => dialogRef.current?.close()}>×</button>
            <p className={styles.eyebrow}><span>MISSION LOG</span> / {selectedEvent.mode.toUpperCase()}</p>
            <h2>{selectedEvent.title}</h2>
            <p className={styles.dialogDescription}>{selectedEvent.description}</p>
            <div className={styles.dialogData}>
              <div><span>DATE</span><b>{formatDate(selectedEvent.startDate)}</b></div>
              <div><span>DURATION</span><b>{formatDuration(selectedEvent.startDate, selectedEvent.endDate)}</b></div>
              <div><span>FORMAT</span><b>{selectedEvent.mode}</b></div>
              <div><span>LOCATION</span><b>{selectedEvent.location}</b></div>
            </div>
            <p className={styles.dialogNote}>Registration, event rules and other mission details are available on the official event page.</p>
            <Link className={styles.primaryButton} href={`/events/${selectedEvent.eventSlug}`}>Open event details <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </dialog>
    </div>
  );
}
