"use client";
import { IEEE_CS_SOCIETY } from "@/lib/contants";
import Image from "next/image";
import { useEffect, useRef } from "react";
const binaryColumns = [
  `0
1
1
0
1
0
1
1
0
0
1
0
1
1
0
1
0
0
1
1
0
1
0
1
1
0
0
1
1
0
1
0`,
  `1
0
0
1
1
0
1
0
0
1
0
1
1
0
0
1
1
0
1
1
0
1
0
0
1
1
0
1
0
1`,
  `0
0
1
1
0
1
0
0
1
1
1
0
1
0
1
0
0
1
1
0
1
0
0
1
1
0
1
1
0
1`,
  `1
1
0
1
0
1
1
0
0
1
1
0
1
0
0
1
0
1
1
0
1
1
0
0
1
0
1
0
1
1`,
  `0
1
0
0
1
1
0
1
0
1
1
0
1
0
0
1
1
0
1
0
1
0
1
1
0
0
1
0
1
0`,
  `1
0
1
1
0
1
0
1
0
0
1
1
0
1
1
0
0
1
0
1
0
1
1
0
1
0
0
1
1
0`,
  `0
1
1
0
1
0
0
1
1
0
1
1
0
1
0
0
1
0
1
1
0
1
0
1
1
0
0
1
0
1`,
];
const events = [
  {
    number: "01",
    title: "Cyber Awareness Workshop",
    description:
      "Understand your digital footprint, privacy and everyday security.",
    type: "WORKSHOP",
    date: "OCT 07",
  },
  {
    number: "02",
    title: "Capture The Flag",
    description:
      "Find vulnerabilities. Solve challenges. Capture the flag.",
    type: "CTF // CYBER",
    date: "OCT 11",
  },
  {
    number: "03",
    title: "Cybersecurity Masterclass",
    description:
      "Learn from people working in technology and security.",
    type: "MASTERCLASS",
    date: "OCT 15",
  },
  {
    number: "04",
    title: "Hack The Future",
    description:
      "Build technology that solves a problem worth solving.",
    type: "HACKATHON",
    date: "OCT 18",
  },
  {
    number: "05",
    title: "Cyber School Tour",
    description:
      "Taking digital safety and technology into classrooms.",
    type: "OUTREACH",
    date: "OCT 22",
  },
];
const terminalMessages = [
  "establishing secure connection...",
  "checking challenge matrix...",
  "scanning attack surface...",
  "loading participants...",
  "encryption layer active...",
  "security protocols enabled...",
  "system ready_",
];
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5.5 font-mono text-[10px] uppercase tracking-[0.16em] text-green">
      {children}
    </div>
  );
}
function Button({
  children,
  href,
  primary = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 px-[21px] py-[15px]",
        "font-mono text-[10px] uppercase transition-all duration-300",
        primary
          ? [
              "border border-green",
              "bg-linear-to-r from-green to-green-bright",
              "font-bold text-[#021009]",
              "shadow-[0_0_25px_rgba(25,214,107,0.12)]",
              "hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(25,214,107,0.24)]",
            ].join(" ")
          : [
              "border border-[rgba(56,217,255,0.35)]",
              "text-cyan",
              "hover:border-cyan hover:bg-[rgba(56,217,255,0.07)]",
            ].join(" "),
      ].join(" ")}
    >
      {children}
    </a>
  );
}
export default function CyberMonthPage() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!cursorGlowRef.current) return;
      cursorGlowRef.current.style.left = `${event.clientX}px`;
      cursorGlowRef.current.style.top = `${event.clientY}px`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!terminalRef.current) return;
      const message =
        terminalMessages[
          Math.floor(Math.random() * terminalMessages.length)
        ];
      const line = document.createElement("div");
      line.innerHTML = `&gt; ${message}`;
      terminalRef.current.appendChild(line);
      while (terminalRef.current.children.length > 10) {
        terminalRef.current.removeChild(
          terminalRef.current.children[0]
        );
      }
    }, 2300);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* =====================================================
          GLOBAL EFFECTS
      ===================================================== */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91,140,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,140,255,.035) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 80%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-90 opacity-[0.035] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noise%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%27.9%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noise)%27_opacity=%27.7%27/%3E%3C/svg%3E')]"
      />
      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed z-[-1] h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,.07),rgba(56,217,255,.025)_35%,transparent_70%)]"
      />
      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <nav className="fixed left-0 right-0 top-0 z-100 flex h-19.5 items-center justify-between border-b border-[rgba(56,217,255,0.08)] bg-[rgba(2,4,8,0.72)] px-[5vw] backdrop-blur-[20px]">
        <a href="#" className="flex items-center gap-3">
          <div className="grid h-8.5 w-8.5 place-items-center bg-linear-to-br  font-mono text-[13px] font-bold text-white shadow-[0_0_25px_rgba(168,85,247,.22)]">
            <Image
                width={34}
                height={34}
                src={IEEE_CS_SOCIETY}
                alt="BSMCE IEEE COMPUTER SOCIETY LOGO"
                className=""
            />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-[-0.02em]">
              BMSCE IEEE COMPUTER SOCIETY
            </div>
            <span className="mt-0.75 block font-mono text-[8px] uppercase tracking-[0.13em] text-cyan">
              Cyber Month // 2026
            </span>
          </div>
        </a>
        <div className="hidden items-center gap-7.5 font-mono text-[10px] uppercase lg:flex">
          <a
            href="#about"
            className="text-[#82918c] transition-colors hover:text-cyan"
          >
            Society
          </a>
          <a
            href="#events"
            className="text-[#82918c] transition-colors hover:text-cyan"
          >
            Events
          </a>
          <a
            href="#hackathon"
            className="text-[#82918c] transition-colors hover:text-cyan"
          >
            Hackathon
          </a>
          <a
            href="#schools"
            className="text-[#82918c] transition-colors hover:text-cyan"
          >
            Outreach
          </a>
          <a
            href="#events"
            className="border border-[rgba(56,217,255,0.5)] px-4.25 py-2.75 text-cyan shadow-[inset_0_0_20px_rgba(56,217,255,.04)] transition-all hover:bg-[rgba(56,217,255,.08)]"
          >
            Explore Cyber Month ↗
          </a>
        </div>
      </nav>
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(168,85,247,.16),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(56,217,255,.07),transparent_28%),linear-gradient(180deg,#020408_0%,#030b08_100%)] px-[5vw] pb-[90px] pt-[150px]">
        {/* Binary field */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          {binaryColumns.map((column, index) => (
            <div
              key={index}
              className="absolute top-[-20%] whitespace-pre font-mono text-[13px] leading-[1.7] text-[rgba(25,214,107,0.14)] animate-[binaryFall_20s_linear_infinite]"
              style={{
                left: `${[4, 13, 27, 42, 58, 73, 88][index]}%`,
                animationDuration: `${[
                  17, 23, 19, 25, 18, 24, 20,
                ][index]}s`,
                opacity:
                  index === 1 || index === 3 ? 0.5 : 1,
              }}
            >
              {column}
            </div>
          ))}
        </div>
        {/* Moving scan */}
        <div className="pointer-events-none absolute inset-0 animate-[scan_7s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(25,214,107,.025),transparent)]" />
        <div className="relative z-10 mx-auto w-full max-w-312.5">
          <div className="mb-6.75 flex items-center gap-[10px] font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-green-bright shadow-[0_0_15px_#19d66b]" />
            BMSCE IEEE COMPUTER SOCIETY PRESENTS
          </div>
          <h1 className="max-w-[1100px] text-[clamp(70px,12vw,165px)] font-black uppercase leading-[0.8] tracking-[-0.09em]">
            <span className="block bg-linear-to-r font-bold text-[171.89px] from-purple via-purple-bright via-68% to-cyan bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,.14)]">
              CYBER
            </span>
            <span className="block bg-linear-to-r font-bold text-[171.89px] from-purple via-purple-bright via-68% to-cyan bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,.14)]">
              MONTH
            </span>
          </h1>
          <div className="mt-7.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-blue">
            LEARN. SECURE. INNOVATE. DEFEND.
          </div>
          <p className="mt-[45px] max-w-[570px] text-[15px] leading-[1.8] text-[#9aa8a3]">
            Technology connects us to everything.
            But every connection creates a risk.
            <strong className="text-white">
              {" "}Cyber Month 2026
            </strong>
            {" "}brings together workshops, flagship events,
            hackathons and school outreach to build
            a safer digital future.
          </p>
          <div className="mt-[35px] flex flex-col gap-3 sm:flex-row">
            <Button href="#events" primary>
              Explore Events ↗
            </Button>
            <Button href="#about">
              Meet BMSCE IEEE Society
            </Button>
          </div>
        </div>
        {/* HUD */}
        <div className="absolute bottom-[12%] right-[6vw] hidden w-[310px] rotate-2 border border-[rgba(25,214,107,.18)] bg-[rgba(2,8,6,.72)] p-[18px] font-mono text-[9px] text-[#59736a] backdrop-blur-[10px] lg:block">
          <div className="mb-[10px] flex justify-between border-b border-[rgba(25,214,107,.12)] pb-3 text-green">
            <span>CYBER_MONITOR</span>
            <span>● ONLINE</span>
          </div>
          {[
            ["NETWORK", "CONNECTED", false],
            ["IDENTITIES", "SCANNING", false],
            ["THREAT LEVEL", "ELEVATED", true],
            ["ENCRYPTION", "ACTIVE", false],
            ["CYBER MONTH", "ONLINE", false],
          ].map(([label, value, warning]) => (
            <div
              key={label as string}
              className="flex justify-between py-[7px]"
            >
              <span>{label}</span>
              <span
                className={
                  warning
                    ? "text-[#ff4d5e]"
                    : "text-cyan"
                }
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* =====================================================
          THREAT
      ===================================================== */}
      <section className="relative border-t border-[rgba(25,214,107,.12)] bg-linear-to-b from-[#030b08] to-black px-[5vw] py-[135px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionLabel>
            01 // YOUR DIGITAL IDENTITY
          </SectionLabel>
          <h1 className="max-w-[950px] text-[clamp(45px,7vw,88px)] font-normal leading-[0.91] tracking-[-0.075em]">
            Your name.
            Your email.
            Your location.
            <br />
            Your{" "}
            <span className="bg-linear-to-r from-purple to-blue bg-clip-text text-transparent">
              digital life.
            </span>
          </h1>
          <div className="mt-[80px] grid grid-cols-1 items-center gap-[70px] lg:grid-cols-2">
            {/* Identity card */}
            <div className="relative min-h-[390px] overflow-hidden border border-[rgba(25,214,107,.18)] bg-linear-to-br from-[rgba(7,28,19,.9)] to-[rgba(2,8,6,.95)] p-7 shadow-[inset_0_0_60px_rgba(25,214,107,.025)]">
              <div className="mb-0 flex justify-between border-b border-[rgba(25,214,107,.12)] pb-[18px] font-mono text-[9px] text-green">
                <span>
                  DIGITAL_IDENTITY // RECORD_8F31
                </span>
                <span className="text-[#ff4d5e]">
                  ● EXPOSED
                </span>
              </div>
              {[
                ["NAME", "XXXX XXXX"],
                ["EMAIL", "XXXX@XXXX"],
                ["PHONE", "+xx XXXXXXXX"],
                ["LOCATION", "XXXXXXXX"],
                ["PASSWORD", "●●●●●●●●●●"],
              ].map(([key, value], index) => (
                <div
                  key={key}
                  className="grid grid-cols-[105px_1fr] border-b border-[rgba(255,255,255,.045)] py-4 font-mono text-[10px]"
                >
                  <span className="text-[#4e635a]">
                    {key}
                  </span>
                  <span
                    className={
                      index === 4
                        ? "text-[#8da49b]"
                        : "tracking-[0.12em] text-purple-bright"
                    }
                  >
                    {value}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[105px_1fr] py-4 font-mono text-[10px]">
                <span className="text-[#4e635a]">
                  STATUS
                </span>
                <span className="text-[#ff4d5e]">
                  COMPROMISED
                </span>
              </div>
            </div>
            {/* Threat copy */}
            <div className="text-[15px] leading-[1.9] text-[#8a9993]">
              <p>
                Every click leaves a trace.
                Every account creates a digital footprint.
                Every piece of information you share becomes
                part of your digital identity.
              </p>
              <p className="mt-5">
                Cybersecurity isn't only about stopping hackers.
                It's about understanding what you're protecting —
                and knowing how easily it can disappear.
              </p>
              <div className="mt-8 border-l-2 border-purple pl-5 text-[20px] leading-[1.45] text-white">
                The first step to staying secure is{" "}
                <span className="text-cyan">
                  knowing what is at risk.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section
        id="about"
        className="border-y border-[rgba(56,217,255,.08)] bg-[radial-gradient(circle_at_20%_50%,rgba(168,85,247,.07),transparent_30%),#03070a] px-[5vw] py-[135px]"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid grid-cols-1 items-end gap-[55px] lg:grid-cols-[1.1fr_.9fr] lg:gap-[100px]">
            <div>
              <SectionLabel>
                02 // THE SOCIETY
              </SectionLabel>
              <h1 className="text-[clamp(55px,7vw,100px)] leading-[0.86] tracking-[-0.08em]">
                We don't just
                <span className="block bg-linear-to-r from-purple via-blue to-cyan bg-clip-text text-transparent">
                  use technology.
                </span>
              </h1>
            </div>
            <div className="text-[15px] leading-[1.85] text-[#8a9994]">
              <p>
                <strong className="text-white">
                  BMSCE IEEE Computer Society
                </strong>{" "}
                is a community of students,
                creators, builders and technology
                enthusiasts exploring the future
                of computing.
              </p>
              <p className="mt-5">
                During Cyber Month, we take that
                curiosity beyond the classroom —
                creating experiences that teach,
                challenge and inspire people to
                think differently about technology.
              </p>
            </div>
          </div>
          {/* Mission grid */}
          <div className="mt-[65px] grid grid-cols-1 border border-[rgba(56,217,255,.10)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "LEARN",
                description:
                  "Understand cybersecurity, privacy and the technology behind modern threats.",
              },
              {
                number: "02",
                title: "BUILD",
                description:
                  "Turn ideas into tools, projects and solutions.",
              },
              {
                number: "03",
                title: "CHALLENGE",
                description:
                  "Solve problems, find vulnerabilities and think differently.",
              },
              {
                number: "04",
                title: "TEACH",
                description:
                  "Take digital awareness beyond campus and into schools.",
              },
            ].map((mission, index) => (
              <div
                key={mission.number}
                className={[
                  "min-h-[180px] border-b border-[rgba(56,217,255,.10)] bg-[rgba(255,255,255,.012)] p-[25px] transition-colors hover:bg-[rgba(168,85,247,.045)]",
                  index !== 3
                    ? "lg:border-r"
                    : "",
                  index % 2 === 0
                    ? "sm:border-r"
                    : "",
                  index === 2
                    ? "sm:border-r-0 lg:border-r"
                    : "",
                  index === 1
                    ? "lg:border-r"
                    : "",
                ].join(" ")}
              >
                <div className="font-mono text-[10px] text-cyan">
                  {mission.number} //
                </div>
                <h3 className="mt-10 text-[18px]">
                  {mission.title}
                </h3>
                <p className="mt-2 text-2.75 leading-[1.7] text-[#586761]">
                  {mission.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* =====================================================
          EVENTS
      ===================================================== */}
      <section
        id="events"
        className="bg-black px-[5vw] py-[135px]"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>
                03 // CYBER MONTH
              </SectionLabel>
              <h1 className="text-[clamp(50px,7vw,90px)] leading-[0.86] tracking-[-0.08em]">
                One month.
                <br />
                Many missions.
              </h1>
            </div>
            <p className="max-w-[360px] text-[13px] leading-[1.8] text-[#71817b]">
              Workshops, cybersecurity challenges,
              technical talks, competitions and
              community outreach.
            </p>
          </div>
          <div className="mt-[70px] border-t border-[rgba(56,217,255,.13)]">
            {events.map((event) => (
              <a
                href="#"
                key={event.number}
                className="group grid grid-cols-[45px_1fr] gap-[25px] border-b border-[rgba(255,255,255,.07)] py-[29px] transition-all duration-300 hover:pl-5 hover:bg-linear-to-r hover:from-[rgba(168,85,247,.05)] hover:to-transparent lg:grid-cols-[60px_1fr_180px_100px]"
              >
                <div className="font-mono text-[10px] text-[#41514c] transition-colors group-hover:text-purple-bright">
                  {event.number}
                </div>
                <div>
                  <h3 className="text-[18px] tracking-[-0.025em]">
                    {event.title}
                  </h3>
                  <p className="mt-[6px] text-2.75 text-[#56635f]">
                    {event.description}
                  </p>
                </div>
                <div className="hidden font-mono text-[9px] uppercase text-cyan lg:block">
                  {event.type}
                </div>
                <div className="hidden text-right font-mono text-[9px] text-green lg:block">
                  {event.date}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* =====================================================
          HACKATHON
      ===================================================== */}
      <section
        id="hackathon"
        className="relative overflow-hidden border-y border-[rgba(168,85,247,.15)] bg-[radial-gradient(circle_at_75%_30%,rgba(168,85,247,.16),transparent_28%),radial-gradient(circle_at_30%_80%,rgba(25,214,107,.08),transparent_30%),#04060b] px-[5vw] py-[135px]"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid grid-cols-1 items-center gap-[55px] lg:grid-cols-[1.2fr_.8fr] lg:gap-[80px]">
            <div>
              <SectionLabel>
                04 // MAIN EVENT
              </SectionLabel>
              <h1 className="text-[clamp(65px,9vw,135px)] leading-[0.77] tracking-[-0.09em]">
                BUILD.
                <br />
                BREAK.
                <br />
                <span className="bg-linear-to-r from-purple via-purple-bright to-cyan bg-clip-text text-transparent">
                  DEFEND.
                </span>
              </h1>
            </div>
            <div>
              <div className="text-[14px] leading-[1.85] text-[#7e8b87]">
                <p>
                  <strong className="text-white">
                    Cyber Month Hackathon
                  </strong>{" "}
                  is where ideas meet pressure.
                </p>
                <p className="mt-5">
                  Find a problem.
                  Build something useful.
                  Work with a team.
                  Defend your idea.
                </p>
              </div>
              {/* Terminal */}
              <div className="mt-[35px] border border-[rgba(25,214,107,.18)] bg-[#010403] shadow-[0_0_50px_rgba(25,214,107,.03)]">
                <div className="flex items-center gap-[6px] border-b border-[rgba(255,255,255,.06)] p-3">
                  <div className="h-[7px] w-[7px] rounded-full bg-[#26312d]" />
                  <div className="h-[7px] w-[7px] rounded-full bg-[#26312d]" />
                  <div className="h-[7px] w-[7px] rounded-full bg-[#26312d]" />
                  <div className="ml-auto font-mono text-[8px] text-[#3e5049]">
                    cyber@bmsce ieee:~
                  </div>
                </div>
                <div
                  ref={terminalRef}
                  className="p-[22px] font-mono text-[10px] leading-[2] text-[#52645b]"
                >
                  <div>
                    <span className="text-green">
                      root@cybermonth
                    </span>
                    :~$ ./initialize
                  </div>
                  <div>
                    &gt; loading challenge matrix...
                  </div>
                  <div>
                    &gt; scanning attack surface...
                  </div>
                  <div>
                    &gt; participants connected...
                  </div>
                  <div>
                    &gt; encryption:
                    <span className="text-cyan">
                      {" "}ACTIVE
                    </span>
                  </div>
                  <div>
                    &gt; threat detection:
                    <span className="text-purple-bright">
                      {" "}ONLINE
                    </span>
                  </div>
                  <div>
                    &gt;{" "}
                    <span className="text-green">
                      SYSTEM READY_
                    </span>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="mt-px grid grid-cols-2 border border-[rgba(25,214,107,.12)]">
                <div className="border-r border-[rgba(25,214,107,.12)] bg-[rgba(25,214,107,.02)] p-[25px]">
                  <strong className="block font-mono text-6.75 text-green">
                    24H
                  </strong>
                  <span className="mt-[6px] block font-mono text-[8px] uppercase text-[#4c5b55]">
                    Build Window
                  </span>
                </div>
                <div className="bg-[rgba(25,214,107,.02)] p-[25px]">
                  <strong className="block font-mono text-6.75 text-green">
                    ∞
                  </strong>
                  <span className="mt-[6px] block font-mono text-[8px] uppercase text-[#4c5b55]">
                    Possibilities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
          SCHOOL OUTREACH
      ===================================================== */}
      <section
        id="schools"
        className="bg-linear-to-b from-black to-[#03110b] px-[5vw] py-[135px]"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid grid-cols-1 items-center gap-[55px] lg:grid-cols-[.9fr_1.1fr] lg:gap-[100px]">
            <div>
              <SectionLabel>
                05 // BEYOND CAMPUS
              </SectionLabel>
              <h1 className="text-[clamp(55px,7vw,95px)] leading-[0.84] tracking-[-0.08em]">
                Start
                <br />
                <span className="bg-linear-to-r from-purple to-blue bg-clip-text text-transparent">
                  early.
                </span>
                <br />
                Stay safe.
              </h1>
            </div>
            <div>
              <div className="text-[15px] leading-[1.9] text-[#82908b]">
                <p>
                  Cybersecurity shouldn't begin
                  after someone gets hacked.
                </p>
                <p className="mt-5">
                  During Cyber Month, BMSCE IEEE Computer
                  Society takes technology and digital
                  safety into schools — helping
                  students understand passwords,
                  phishing, privacy, digital footprints,
                  AI and the digital world around them.
                </p>
              </div>
              <div className="mt-[35px] border-l-2 border-cyan bg-[rgba(56,217,255,.025)] px-[25px] py-[22px] font-mono text-[10px] leading-[2] text-[#52655e]">
                <div>
                  <strong className="text-green">
                    OUTREACH_PROTOCOL
                  </strong>
                </div>
                <div>
                  &gt; CONNECTING_TO_CLASSROOM...
                </div>
                <div>
                  &gt; DIGITAL_SAFETY_MODULE: LOADED
                </div>
                <div>
                  &gt; KNOWLEDGE_TRANSFER: ACTIVE
                </div>
                <div>
                  &gt; STATUS:{" "}
                  <strong className="text-green">
                    MISSION_ACCEPTED
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
          IMPACT
      ===================================================== */}
      <section className="border-t border-[rgba(56,217,255,.08)] bg-black px-[5vw] py-[135px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-[45px] font-mono text-[9px] uppercase tracking-[0.17em] text-purple-bright">
            06 // THE SIGNAL
          </div>
          <div className="grid grid-cols-1 border-l border-t border-[rgba(56,217,255,.12)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["12+", "Events"],
              ["08+", "Workshops"],
              ["06+", "Schools"],
              ["500+", "People Reached"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="border-b border-r border-[rgba(56,217,255,.12)] p-[45px_30px]"
              >
                <strong className="block bg-linear-to-r from-purple via-blue to-cyan bg-clip-text text-[clamp(42px,5vw,72px)] leading-none tracking-[-0.08em] text-transparent">
                  {number}
                </strong>
                <span className="mt-[13px] block font-mono text-[8px] uppercase text-[#52615c]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-[radial-gradient(circle,rgba(168,85,247,.12),transparent_42%),#020408] px-[5vw] py-[135px] text-center">
        {/* Orbits */}
        <div className="absolute left-1/2 top-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(168,85,247,.08)]">
          <div className="absolute inset-[80px] rounded-full border border-dashed border-[rgba(56,217,255,.09)]" />
          <div className="absolute inset-[200px] rounded-full border border-[rgba(25,214,107,.09)]" />
        </div>
        <div className="relative z-10 w-full">
          <div className="mb-[25px] font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">
            SYSTEM // AWAITING USER
          </div>
          <h1 className="text-[clamp(65px,12vw,170px)] leading-[0.78] tracking-[-0.095em]">
            ENTER
            <br />
            <span className="bg-linear-to-r from-purple via-purple-bright to-cyan bg-clip-text text-transparent">
              THE GRID.
            </span>
          </h1>
          <p className="mx-auto my-[35px] max-w-[520px] text-[14px] leading-[1.8] text-[#75847e]">
            Learn something new.
            Build something meaningful.
            Protect something important.
          </p>
          <Button href="#events" primary>
            Enter Cyber Month ↗
          </Button>
        </div>
      </section>
      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="flex flex-col justify-between gap-5 border-t border-[rgba(255,255,255,.06)] px-[5vw] py-7 font-mono text-[8px] uppercase text-[#45534e] sm:flex-row">
        <span>
          BMSCE IEEE COMPUTER SOCIETY // CYBER MONTH 2026
        </span>
        <span className="text-green">
          SYSTEM STATUS: SECURE_
        </span>
      </footer>
    </main>
  );
}