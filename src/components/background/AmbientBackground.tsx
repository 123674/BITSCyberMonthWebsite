"use client";

import { useEffect, useRef } from "react";
import styles from "./AmbientBackground.module.css";

const PURPLE = "177, 77, 255";
const NEON_BLUE = "31, 182, 255";
const LINK_DISTANCE = 140;
const CURSOR_DISTANCE = 180;
const PING_EVERY_MS = 2600;
const PING_MS = 1800;
// Peak opacities — raise these to make the network brighter.
const LINK_ALPHA = 0.28;
const NODE_ALPHA = 0.9;
const CURSOR_LINK_ALPHA = 0.5;
const PING_ALPHA = 0.55;

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    // 0.3 (far) → 1 (near): scales brightness and scroll parallax.
    depth: number;
    color: string;
    phase: number;
};

type Ping = { node: Node; start: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Site-wide ambient layer: a drifting node network that reacts to the cursor and scroll.
// It sits above the page as a faint screen-blended, click-through overlay so the
// opaque section backgrounds don't hide it. A separate layer underneath darkens
// the page around the cursor so the network stands out there.
export default function AmbientBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shadeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const shade = shadeRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !shade) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let width = 0;
        let height = 0;
        let nodes: Node[] = [];
        let pings: Ping[] = [];
        let lastPing = 0;
        let frame = 0;
        let lastTime = performance.now();
        const pointer = { x: -9999, y: -9999 };

        const build = () => {
            const count = Math.round(Math.min(90, Math.max(28, (width * height) / 17000)));
            nodes = Array.from({ length: count }, () => {
                const depth = rand(0.3, 1);
                return {
                    x: rand(0, width),
                    y: rand(0, height),
                    vx: rand(-0.12, 0.12) * depth,
                    vy: rand(-0.1, 0.1) * depth,
                    r: rand(0.6, 1.8) * depth,
                    depth,
                    color: Math.random() < 0.7 ? PURPLE : NEON_BLUE,
                    phase: rand(0, Math.PI * 2),
                };
            });
            pings = [];
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const prevW = width;
            const prevH = height;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Mobile browsers resize as the URL bar shows/hides; only rebuild on real changes.
            if (!nodes.length || Math.abs(width - prevW) > 80 || Math.abs(height - prevH) > 160) build();
        };

        const draw = (time: number) => {
            const f = Math.min((time - lastTime) / (1000 / 60), 3);
            lastTime = time;
            const scroll = window.scrollY;
            ctx.clearRect(0, 0, width, height);

            // Positions after drift + scroll parallax (near nodes shift more), wrapped to the screen.
            const points = nodes.map((n) => {
                if (!reducedMotion) {
                    n.x += n.vx * f;
                    n.y += n.vy * f;
                    if (n.x < -20) n.x += width + 40;
                    if (n.x > width + 20) n.x -= width + 40;
                    if (n.y < -20) n.y += height + 40;
                    if (n.y > height + 20) n.y -= height + 40;
                }
                const span = height + 40;
                const y = ((((n.y - scroll * 0.12 * n.depth + 20) % span) + span) % span) - 20;
                return { n, x: n.x, y };
            });

            ctx.lineWidth = 0.7;
            for (let i = 0; i < points.length; i++) {
                const a = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const b = points[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq > LINK_DISTANCE * LINK_DISTANCE) continue;
                    const alpha = (1 - Math.sqrt(distSq) / LINK_DISTANCE) * LINK_ALPHA * Math.min(a.n.depth, b.n.depth);
                    ctx.strokeStyle = `rgba(${a.n.color}, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }

                // Nodes near the cursor reach out to it.
                const cdx = a.x - pointer.x;
                const cdy = a.y - pointer.y;
                const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy);
                if (cursorDist < CURSOR_DISTANCE) {
                    ctx.strokeStyle = `rgba(${a.n.color}, ${(1 - cursorDist / CURSOR_DISTANCE) * CURSOR_LINK_ALPHA * a.n.depth})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }

            for (const { n, x, y } of points) {
                const twinkle = reducedMotion ? 1 : 0.6 + 0.4 * Math.sin(n.phase + time / 900);
                // Nodes inside the cursor spotlight glow brighter and larger.
                const cursorDist = Math.hypot(x - pointer.x, y - pointer.y);
                const boost = cursorDist < CURSOR_DISTANCE ? 1 - cursorDist / CURSOR_DISTANCE : 0;
                ctx.fillStyle = `rgba(${n.color}, ${Math.min(1, NODE_ALPHA * n.depth * twinkle + boost * 0.4)})`;
                ctx.beginPath();
                ctx.arc(x, y, n.r * (1 + boost * 0.8), 0, Math.PI * 2);
                ctx.fill();
            }

            // Occasional radar ping from a random near node.
            if (!reducedMotion) {
                if (time - lastPing > PING_EVERY_MS) {
                    lastPing = time;
                    const near = nodes.filter((n) => n.depth > 0.6);
                    if (near.length) pings.push({ node: near[Math.floor(Math.random() * near.length)], start: time });
                }
                pings = pings.filter((p) => time - p.start < PING_MS);
                for (const p of pings) {
                    const k = (time - p.start) / PING_MS;
                    const point = points.find((pt) => pt.n === p.node);
                    if (!point) continue;
                    ctx.strokeStyle = `rgba(${p.node.color}, ${PING_ALPHA * (1 - k)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 4 + k * 70, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            frame = reducedMotion ? 0 : requestAnimationFrame(draw);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            shade.style.setProperty("--x", `${e.clientX}px`);
            shade.style.setProperty("--y", `${e.clientY}px`);
            shade.dataset.active = "true";
        };
        const onPointerLeave = () => {
            pointer.x = pointer.y = -9999;
            delete shade.dataset.active;
        };
        // Don't burn battery while the tab is hidden.
        const onVisibility = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            if (!document.hidden) {
                lastTime = performance.now();
                frame = requestAnimationFrame(draw);
            }
        };
        const onScroll = () => {
            if (reducedMotion) requestAnimationFrame(draw);
        };

        resize();
        frame = requestAnimationFrame(draw);
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener("pointerleave", onPointerLeave);
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <div ref={shadeRef} className={styles.shade} aria-hidden="true" />
            <div className={styles.layer} aria-hidden="true">
                <canvas ref={canvasRef} className={styles.canvas} />
                <div className={styles.scan} />
            </div>
        </>
    );
}
