"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useReveal } from "@/components/site/useReveal";

/* ─── About Section Content (from bmsceieeecs.in) ───────────────────────────── */
const ABOUT_STATS = [
  { value: "2144+", label: "Members" },
  { value: "75+", label: "Events" },
  { value: "6", label: "Prestigious Awards" },
];

const ABOUT_PILLARS = [
  {
    title: "Vision",
    text: "To grow into a premier technical society, fostering eminent professionals with creative minds, innovative ideas, sound practical skills, team spirit and true leadership qualities.",
  },
  {
    title: "Mission",
    text: "Providing individuals with state-of-the-art knowledge in various technological disciplines, while instilling a strong sense of social consciousness and professionalism.",
  },
];

const ABOUT_INITIATIVES = [
  {
    title: "Wings",
    text: "A learning community with Competitive Programming and Web Development tracks, offering mentorship, workshops and hackathons for students of every level.",
  },
  {
    title: "IEEE CS Project Series",
    text: "A 4–8 month mentored program where members turn ideas into finished projects with guidance from industry experts, with opportunities for research publication.",
  },
  {
    title: "CS Reach",
    text: "An outreach initiative introducing young students to Computer Science through interactive learning and hands-on activities.",
  },
];

const ABOUT_LINKS = [
  { label: "Email", href: "mailto:ieee.cs@bmsce.ac.in" },
  { label: "Instagram", href: "https://www.instagram.com/bmsce_ieeecs/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/bmsce-ieee-computer-society" },
  { label: "GitHub", href: "https://github.com/BMSCE-IEEE-CS" },
  { label: "Website", href: "https://www.bmsceieeecs.in/" },
];

/* ─── About Page Component ──────────────────────────────────────────────────── */
export default function AboutPage() {
  useReveal();


  return (
    <SiteChrome>

      {/* ── Main About Content ── */}
      <main className="about-section">
        <style>{`
          .about-section {
            position: relative;
            z-index: 1;
            max-width: 1100px;
            margin: 0 auto;
            padding: 120px 1.5rem 5rem;
            font-family: 'Space Grotesk', system-ui, sans-serif;
            color: rgba(220, 228, 245, 0.88);
          }
          .about-eyebrow {
            font-size: 0.95rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 0.75rem;
          }
          .about-title {
            font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
            font-size: clamp(1.8rem, 3.4vw, 2.8rem);
            font-weight: 800;
            line-height: 1.15;
            text-transform: uppercase;
            margin: 0 0 1.5rem;
            background: linear-gradient(125deg, #60a5fa 0%, #a855f7 45%, #c084fc 75%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .about-intro {
            font-size: 1.1rem;
            line-height: 1.75;
            max-width: 820px;
            margin: 0 0 3rem;
          }
          .about-subheading {
            font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #e2e8f0;
            margin: 3.5rem 0 1.25rem;
          }
          .about-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
            gap: 1.25rem;
          }
          .about-card {
            background: rgba(15, 23, 42, 0.62);
            border: 1px solid rgba(96, 165, 250, 0.22);
            border-radius: 14px;
            padding: 1.5rem;
            backdrop-filter: blur(6px);
            transition: border-color 0.2s ease, transform 0.2s ease;
          }
          .about-card:hover {
            border-color: rgba(168, 85, 247, 0.55);
            transform: translateY(-3px);
          }
          .about-card h3 {
            margin: 0 0 0.6rem;
            font-size: 1.15rem;
            font-weight: 700;
            color: #93c5fd;
          }
          .about-card p {
            margin: 0;
            line-height: 1.65;
            font-size: 0.98rem;
          }
          .about-stat {
            text-align: center;
          }
          .about-stat-value {
            font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
            font-size: clamp(2rem, 4vw, 2.8rem);
            font-weight: 800;
            background: linear-gradient(90deg, #60a5fa 0%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .about-stat-label {
            margin-top: 0.25rem;
            font-size: 0.85rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(200, 210, 230, 0.75);
          }
          .about-links {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .about-link {
            padding: 0.55rem 1.1rem;
            border-radius: 999px;
            border: 1px solid rgba(96, 165, 250, 0.4);
            color: #e2e8f0;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.92rem;
            transition: background 0.2s ease, border-color 0.2s ease;
          }
          .about-link:hover {
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
            border-color: rgba(168, 85, 247, 0.6);
          }
        `}</style>

        <p className="about-eyebrow reveal-onload">About Us</p>
        <h1 className="about-title reveal-onload" style={{ animationDelay: "100ms" }}>BMSCE IEEE Computer Society</h1>
        <p className="about-intro reveal-onload" style={{ animationDelay: "200ms" }}>
          Established in 2021, BMSCE IEEE Computer Society quickly became a central hub for
          tech enthusiasts, attracting over 400 participants in its first year. Our core
          mission is to enhance and upskill the technical knowledge of our members, empowering
          them to become future leaders in computing. Through national-level hackathons,
          workshops and codeathons, we bring together engineers, scientists and industry
          professionals for dialogue, debate and collaboration.
        </p>

        <div className="about-grid">
          {ABOUT_STATS.map((stat, i) => (
            <div key={stat.label} className="about-card about-stat reveal-onload" style={{ animationDelay: `${300 + i * 120}ms` }}>
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <h3 className="about-subheading reveal">Vision &amp; Mission</h3>
        <div className="about-grid">
          {ABOUT_PILLARS.map((pillar, i) => (
            <div key={pillar.title} className="about-card reveal" style={{ animationDelay: `${i * 120}ms` }}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </div>
          ))}
        </div>

        <h3 className="about-subheading reveal">Our Initiatives</h3>
        <div className="about-grid">
          {ABOUT_INITIATIVES.map((item, i) => (
            <div key={item.title} className="about-card reveal" style={{ animationDelay: `${i * 120}ms` }}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <h3 className="about-subheading reveal">Connect With Us</h3>
        <div className="about-links reveal" style={{ animationDelay: "100ms" }}>
          {ABOUT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="about-link"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
