"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./EntranceIntro.module.css";

// Final frame: the exact logo, with the transparent symbol cut-out filled white.
const LOGO_SRC = "/ieee-cs-logo-filled.png";
const SESSION_KEY = "cm-intro-seen";

// Timeline (ms from start).
const ASSEMBLE_AT = 900;
const ASSEMBLE_SPREAD = 2100;
const LOGO_REVEAL_AT = 3450;
const FRAGMENTS_FADE_AT = 3850;
const FRAGMENTS_FADE_MS = 650;
const PULSE_AT = 4450;
const EXIT_AT = 6000;
const EXIT_MS = 850;

const ORANGE = "249, 163, 26";
const WHITE = "255, 255, 255";
// The source logo is 512×512; all geometry below is in that space.
const LOGO_UNITS = 512;

type Point = [number, number];

type Fragment = {
    pts: Point[];
    // Target centroid in logo units.
    tx: number;
    ty: number;
    color: string;
    width: number;
    start: number;
    dur: number;
    late: boolean;
    sx: number;
    sy: number;
    vx: number;
    vy: number;
    rot0: number;
    spin: number;
    scaleX: number;
    scaleY: number;
};

type Decor = {
    kind: "line" | "arc" | "circle";
    size: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    spin: number;
    alpha: number;
    color: string;
};

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    color: string;
    twinkle: number;
    // Some particles get drawn into the logo outline and dissolve there.
    target: Point | null;
    start: number;
    dur: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInQuad = (t: number) => t * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function arcPoints(cx: number, cy: number, rx: number, ry: number, from: number, to: number): Point[] {
    const steps = Math.max(6, Math.ceil(Math.abs(to - from) / 0.08));
    return Array.from({ length: steps + 1 }, (_, i) => {
        const a = from + ((to - from) * i) / steps;
        return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Point;
    });
}

function splitEllipse(cx: number, cy: number, rx: number, ry: number, from: number, to: number, pieces: number) {
    const span = (to - from) / pieces;
    return Array.from({ length: pieces }, (_, i) => arcPoints(cx, cy, rx, ry, from + span * i, from + span * (i + 1)));
}

function splitLine(a: Point, b: Point, pieces: number): Point[][] {
    return Array.from({ length: pieces }, (_, i) => [
        [lerp(a[0], b[0], i / pieces), lerp(a[1], b[1], i / pieces)],
        [lerp(a[0], b[0], (i + 1) / pieces), lerp(a[1], b[1], (i + 1) / pieces)],
    ]);
}

// Outlines measured from public/ieee-cs-logo.png, ordered outer → inner.
function logoOutlines(): { paths: Point[][]; color: string; width: number }[] {
    const TAU = Math.PI * 2;
    return [
        // Outer circular form.
        { paths: splitEllipse(255.5, 255, 247.5, 227, -Math.PI / 2, TAU - Math.PI / 2, 12), color: ORANGE, width: 2.4 },
        // Φ ring.
        { paths: splitEllipse(256, 258, 170, 102, -Math.PI / 2, TAU - Math.PI / 2, 8), color: WHITE, width: 1.8 },
        // Inner counters.
        {
            paths: [
                ...splitEllipse(219, 258, 63, 66, Math.PI / 2, Math.PI * 1.5, 3),
                ...splitEllipse(292, 258, 65, 72, -Math.PI / 2, Math.PI / 2, 3),
            ],
            color: WHITE,
            width: 1.6,
        },
        // Central "1": stem, flag and base.
        {
            paths: [
                ...splitLine([219, 125], [219, 395], 2),
                ...splitLine([292, 72], [292, 395], 2),
                [[170, 95], [228, 90], [292, 72]],
                [[170, 95], [170, 125], [219, 125]],
                ...splitLine([168, 395], [343, 395], 2),
                [[168, 395], [168, 420], [343, 420], [343, 395]],
            ],
            color: WHITE,
            width: 1.6,
        },
    ];
}

function buildFragments(width: number, height: number): Fragment[] {
    const groups = logoOutlines();
    const total = groups.reduce((n, g) => n + g.paths.length, 0);
    const reach = Math.max(width, height);
    const fragments: Fragment[] = [];
    let k = 0;

    for (const group of groups) {
        for (const path of group.paths) {
            const order = k / (total - 1);
            const tx = path.reduce((s, p) => s + p[0], 0) / path.length;
            const ty = path.reduce((s, p) => s + p[1], 0) / path.length;
            const angle = rand(0, Math.PI * 2);
            const dist = rand(0.28, 0.55) * reach;
            const swirl = rand(14, 34) * (Math.random() < 0.5 ? -1 : 1);
            fragments.push({
                pts: path.map(([x, y]) => [x - tx, y - ty]),
                tx,
                ty,
                color: group.color,
                width: group.width,
                // Square-root spacing: gaps shrink, so assembly accelerates toward the end.
                start: ASSEMBLE_AT + ASSEMBLE_SPREAD * Math.sqrt(order) + rand(-60, 60),
                dur: lerp(1350, 620, order),
                late: order > 0.6,
                sx: width / 2 + Math.cos(angle) * dist,
                sy: height / 2 + Math.sin(angle) * dist,
                // Drift tangentially so the field slowly swirls.
                vx: -Math.sin(angle) * swirl,
                vy: Math.cos(angle) * swirl,
                rot0: rand(-Math.PI, Math.PI),
                spin: rand(-0.5, 0.5),
                scaleX: rand(0.5, 1.7),
                scaleY: rand(0.5, 1.5),
            });
            k++;
        }
    }
    return fragments;
}

function buildDecor(width: number, height: number): Decor[] {
    return Array.from({ length: 26 }, () => {
        const kinds: Decor["kind"][] = ["line", "line", "arc", "circle"];
        return {
            kind: kinds[Math.floor(Math.random() * kinds.length)],
            size: rand(8, 90),
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-14, 14),
            vy: rand(-10, 10),
            rot: rand(0, Math.PI * 2),
            spin: rand(-0.4, 0.4),
            alpha: rand(0.18, 0.45),
            color: Math.random() < 0.3 ? ORANGE : WHITE,
        };
    });
}

function buildParticles(width: number, height: number): Particle[] {
    const outlines = logoOutlines().flatMap((g) => g.paths.flat());
    return Array.from({ length: Math.round(Math.min(160, (width * height) / 9000)) }, (_, i) => {
        const drawn = i % 5 < 2;
        return {
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-8, 8),
            vy: rand(-12, 4),
            r: rand(0.5, 1.6),
            alpha: rand(0.2, 0.75),
            color: Math.random() < 0.25 ? ORANGE : WHITE,
            twinkle: rand(0, Math.PI * 2),
            target: drawn ? outlines[Math.floor(Math.random() * outlines.length)] : null,
            start: rand(1500, 3300),
            dur: rand(700, 1200),
        };
    });
}

export default function EntranceIntro() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoBoxRef = useRef<HTMLDivElement>(null);
    const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");

    useEffect(() => {
        const root = document.documentElement;
        const overlay = overlayRef.current;
        const canvas = canvasRef.current;
        const logoBox = logoBoxRef.current;
        const ctx = canvas?.getContext("2d");
        const timers: number[] = [];
        let frame = 0;
        let finished = false;

        let alreadySeen = false;
        try {
            alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
        } catch {
            // Storage unavailable — just play the intro.
        }
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const finish = (immediate: boolean) => {
            if (finished) return;
            finished = true;
            try {
                sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
                // Ignore — the intro will simply play again next visit.
            }
            // Lets the home page start its entrance animations as the intro clears.
            root.dataset.intro = "done";
            root.style.overflow = "";
            if (immediate) {
                timers.push(window.setTimeout(() => setPhase("gone"), 0));
                return;
            }
            setPhaseLater("leaving", 0);
            setPhaseLater("gone", EXIT_MS);
        };
        const setPhaseLater = (next: "leaving" | "gone", delay: number) => {
            timers.push(window.setTimeout(() => setPhase(next), delay));
        };

        if (alreadySeen || reducedMotion || !overlay || !canvas || !ctx || !logoBox) {
            finish(true);
            return () => timers.forEach(clearTimeout);
        }

        root.style.overflow = "hidden";
        overlay.dataset.running = "true";

        let width = 0;
        let height = 0;
        let fragments: Fragment[] = [];
        let decor: Decor[] = [];
        let particles: Particle[] = [];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);
        };
        resize();
        fragments = buildFragments(width, height);
        decor = buildDecor(width, height);
        particles = buildParticles(width, height);

        const startTime = performance.now();

        const draw = (now: number) => {
            const t = now - startTime;
            // Logo box is laid out centred; its untransformed size sets the logo scale.
            const size = logoBox.offsetWidth;
            const unit = size / LOGO_UNITS;
            const ox = width / 2 - size / 2;
            const oy = height / 2 - size / 2;
            const toScreen = (x: number, y: number): Point => [ox + x * unit, oy + y * unit];
            const fadeOut = 1 - clamp01((t - FRAGMENTS_FADE_AT) / FRAGMENTS_FADE_MS);

            // Translucent clear leaves short trails behind moving pieces (cheap motion blur).
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.fillStyle = t > FRAGMENTS_FADE_AT + FRAGMENTS_FADE_MS ? "#000" : "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, width, height);

            const pull = easeInQuad(clamp01((t - 1800) / 1800));
            const center: Point = [width / 2, height / 2];

            // Free-floating fragments: drift, then get drawn toward the centre and dissolve.
            ctx.lineCap = "round";
            for (const d of decor) {
                const sec = t / 1000;
                const x = lerp(d.x + d.vx * sec, center[0], pull * 0.45);
                const y = lerp(d.y + d.vy * sec, center[1], pull * 0.45);
                const alpha = d.alpha * clamp01(t / 900) * (1 - clamp01((t - 2400) / 1300));
                if (alpha <= 0) continue;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(d.rot + d.spin * sec);
                ctx.strokeStyle = `rgba(${d.color}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (d.kind === "line") {
                    ctx.moveTo(-d.size, 0);
                    ctx.lineTo(d.size, 0);
                } else if (d.kind === "arc") {
                    ctx.arc(0, 0, d.size * 0.6, 0, Math.PI * 0.6);
                } else {
                    ctx.arc(0, 0, d.size * 0.15, 0, Math.PI * 2);
                }
                ctx.stroke();
                ctx.restore();
            }

            // Particles.
            for (const p of particles) {
                const sec = t / 1000;
                let x = p.x + p.vx * sec;
                let y = p.y + p.vy * sec;
                let alpha = p.alpha * (0.65 + 0.35 * Math.sin(p.twinkle + sec * 2.2)) * clamp01(t / 700);
                if (p.target && t > p.start) {
                    const k = easeInOutCubic(clamp01((t - p.start) / p.dur));
                    const [txp, typ] = toScreen(p.target[0], p.target[1]);
                    x = lerp(x, txp, k);
                    y = lerp(y, typ, k);
                    alpha *= 1 - clamp01((k - 0.75) / 0.25);
                } else {
                    alpha *= 1 - clamp01((t - 3600) / 900);
                }
                if (alpha <= 0.01) continue;
                ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Logo fragments: drift independently, then magnetically align into the outline.
            if (fadeOut > 0) {
                for (const f of fragments) {
                    const appear = clamp01((t - 150 - f.start * 0.12) / 700);
                    const drift = (time: number) => ({
                        x: f.sx + (f.vx * time) / 1000,
                        y: f.sy + (f.vy * time) / 1000,
                        rot: f.rot0 + (f.spin * time) / 1000,
                    });
                    const [targetX, targetY] = toScreen(f.tx, f.ty);
                    let x: number, y: number, rot: number, sx: number, sy: number;
                    let snapGlow = 0;
                    if (t < f.start) {
                        ({ x, y, rot } = drift(t));
                        sx = f.scaleX;
                        sy = f.scaleY;
                    } else {
                        const raw = clamp01((t - f.start) / f.dur);
                        const k = f.late ? easeOutQuart(raw) : easeInOutCubic(raw);
                        const from = drift(f.start);
                        // Unwind rotation along the shortest path.
                        const fromRot = Math.atan2(Math.sin(from.rot), Math.cos(from.rot));
                        x = lerp(from.x, targetX, k);
                        y = lerp(from.y, targetY, k);
                        rot = lerp(fromRot, 0, k);
                        sx = lerp(f.scaleX, 1, k);
                        sy = lerp(f.scaleY, 1, k);
                        // Brief flare the moment a piece locks in.
                        const sinceLock = t - (f.start + f.dur);
                        if (sinceLock > 0) snapGlow = 1 - clamp01(sinceLock / 320);
                    }
                    const alpha = appear * fadeOut * (0.7 + 0.3 * snapGlow);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rot);
                    ctx.scale(sx * unit, sy * unit);
                    ctx.strokeStyle = `rgba(${f.color}, ${alpha})`;
                    ctx.shadowColor = `rgba(${f.color}, ${0.5 + 0.5 * snapGlow})`;
                    ctx.shadowBlur = 6 + 10 * snapGlow;
                    ctx.lineWidth = (f.width + snapGlow) / unit;
                    ctx.lineJoin = "round";
                    ctx.beginPath();
                    f.pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
                    ctx.stroke();
                    ctx.restore();
                }
            }

            frame = t < EXIT_AT ? requestAnimationFrame(draw) : 0;
        };
        frame = requestAnimationFrame(draw);

        timers.push(window.setTimeout(() => finish(false), EXIT_AT));

        // Any click or key skips straight to the site.
        const skip = () => finish(false);
        overlay.addEventListener("pointerdown", skip);
        window.addEventListener("keydown", skip);
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(frame);
            timers.forEach(clearTimeout);
            overlay.removeEventListener("pointerdown", skip);
            window.removeEventListener("keydown", skip);
            window.removeEventListener("resize", resize);
            root.style.overflow = "";
        };
    }, []);

    if (phase === "gone") return null;

    const timeline = {
        "--reveal-at": `${LOGO_REVEAL_AT}ms`,
        "--pulse-at": `${PULSE_AT}ms`,
        "--total": `${EXIT_AT + EXIT_MS}ms`,
    } as CSSProperties;

    return (
        <div ref={overlayRef} className={styles.overlay} data-phase={phase} style={timeline} aria-hidden="true">
            <div className={styles.stage}>
                <canvas ref={canvasRef} className={styles.canvas} />
                <div ref={logoBoxRef} className={styles.logoBox}>
                    <div className={styles.glow} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={styles.logo} src={LOGO_SRC} alt="" draggable={false} fetchPriority="high" />
                    <div className={styles.pulse} style={{ maskImage: `url(${LOGO_SRC})`, WebkitMaskImage: `url(${LOGO_SRC})` }} />
                </div>
            </div>
        </div>
    );
}
