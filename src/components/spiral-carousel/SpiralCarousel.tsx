"use client";

import { useEffect, useRef, useState } from "react";
import { placeholderSpiralItems, type SpiralItem } from "./spiralItems";
import styles from "./SpiralCarousel.module.css";

const CARDS_PER_TURN = 8;
const ANGLE_STEP = 360 / CARDS_PER_TURN;
// Cards further than this (in card steps) from the front fade out.
const VISIBLE_RANGE = 3.6;
// Momentum decay per 60fps frame while coasting.
const FRICTION = 0.94;
// Fraction of the remaining distance covered per frame while snapping.
const SNAP_EASE = 0.14;
// Below this speed (cards per frame) coasting hands over to snapping.
const MIN_COAST_SPEED = 0.012;
// Pointer travel (px) after which a press counts as a drag, not a click.
const DRAG_THRESHOLD = 6;
// How far past either end a drag can stretch (fraction of the overshoot).
const RUBBER_BAND = 0.35;
const FRAME_MS = 1000 / 60;

type Mode = "idle" | "drag" | "coast" | "snap";

type SpiralCarouselProps = {
    items?: SpiralItem[];
    // Called when the front card is clicked or Enter is pressed on it.
    onSelect?: (item: SpiralItem, index: number) => void;
    className?: string;
    // "horizontal" lets vertical wheel scrolling pass through to the page.
    wheelAxis?: "both" | "horizontal";
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function SpiralCarousel({ items = placeholderSpiralItems, onSelect, className, wheelAxis = "both" }: SpiralCarouselProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const goToRef = useRef<(index: number) => void>(() => {});
    const onSelectRef = useRef(onSelect);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    useEffect(() => {
        const viewport = viewportRef.current;
        const scene = sceneRef.current;
        if (!viewport || !scene || items.length === 0) return;

        const maxPos = items.length - 1;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const snapEase = reducedMotion ? 0.5 : SNAP_EASE;

        // Position is measured in cards: 0 = first card in front, 1 = second, ...
        let pos = 0;
        let vel = 0;
        let mode: Mode = "idle";
        let snapTarget = 0;
        let shownIndex = 0;

        let radius = 300;
        let stepY = 60;
        let pxPerCard = 200;

        let pointerId: number | null = null;
        let captured = false;
        let dragStartX = 0;
        let dragStartPos = 0;
        let lastX = 0;
        let lastMoveTime = 0;
        let dragDistance = 0;
        let suppressClick = false;

        let frame = 0;
        let lastFrameTime = 0;

        const layout = () => {
            const width = viewport.clientWidth;
            const cardW = clamp(width * 0.4, 150, 320);
            const cardH = cardW / 1.5;
            // Radius that keeps neighbouring cards from overlapping on the cylinder.
            radius = (cardW / 2 / Math.tan(Math.PI / CARDS_PER_TURN)) * 1.12;
            stepY = cardH * 0.32;
            pxPerCard = clamp(cardW * 0.9, 120, 280);
            viewport.style.setProperty("--card-w", `${cardW}px`);
            viewport.style.setProperty("--card-h", `${cardH}px`);
            viewport.style.setProperty("--perspective", `${Math.max(900, width * 1.6)}px`);
        };

        const render = () => {
            // Near either end only one side of the spiral has cards, so shift the
            // scene to keep the visible cards centred instead of half the stage empty.
            const shift = stepY * (clamp(maxPos - pos, 0, 1.5) - clamp(pos, 0, 1.5)) * 1.2;
            scene.style.transform = `translateY(${-shift}px) translateZ(${-radius}px) rotateX(-6deg)`;
            for (let i = 0; i < items.length; i++) {
                const card = cardRefs.current[i];
                if (!card) continue;
                const offset = i - pos;
                const distance = Math.abs(offset);
                const angle = offset * ANGLE_STEP;
                const facing = Math.cos((angle * Math.PI) / 180);
                const opacity = clamp(VISIBLE_RANGE + 1 - distance, 0, 1);
                card.style.transform = `translate3d(0, ${offset * stepY}px, 0) rotateY(${angle}deg) translateZ(${radius}px)`;
                // Fade is applied on the faces: opacity on a preserve-3d element would flatten it.
                card.style.setProperty("--fade", `${opacity}`);
                card.style.visibility = opacity === 0 ? "hidden" : "visible";
                // 0 when facing the viewer, 1 when at the back of the spiral.
                card.style.setProperty("--shade", `${(1 - facing) / 2}`);
                card.style.pointerEvents = distance < 2.5 ? "auto" : "none";
                card.dataset.active = String(Math.round(pos) === i);
            }

            const nearest = clamp(Math.round(pos), 0, maxPos);
            if (nearest !== shownIndex) {
                shownIndex = nearest;
                setActiveIndex(nearest);
            }
        };

        const tick = (time: number) => {
            const f = Math.min((time - lastFrameTime) / FRAME_MS, 3);
            lastFrameTime = time;

            if (mode === "coast") {
                pos += vel * f;
                vel *= Math.pow(FRICTION, f);
                const outOfBounds = pos < 0 || pos > maxPos;
                if (outOfBounds || Math.abs(vel) < MIN_COAST_SPEED) {
                    mode = "snap";
                    snapTarget = clamp(Math.round(pos), 0, maxPos);
                }
            }

            if (mode === "snap") {
                const diff = snapTarget - pos;
                pos += diff * (1 - Math.pow(1 - snapEase, f));
                if (Math.abs(diff) < 0.0005) {
                    pos = snapTarget;
                    vel = 0;
                    mode = "idle";
                }
            }

            render();
            frame = mode === "idle" || mode === "drag" ? 0 : requestAnimationFrame(tick);
        };

        const wake = () => {
            if (frame) return;
            lastFrameTime = performance.now();
            frame = requestAnimationFrame(tick);
        };

        const goTo = (index: number) => {
            snapTarget = clamp(index, 0, maxPos);
            vel = 0;
            mode = "snap";
            wake();
        };
        goToRef.current = goTo;

        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            pointerId = e.pointerId;
            captured = false;
            dragStartX = lastX = e.clientX;
            dragStartPos = pos;
            lastMoveTime = e.timeStamp;
            dragDistance = 0;
            vel = 0;
            mode = "drag";
            cancelAnimationFrame(frame);
            frame = 0;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (mode !== "drag" || e.pointerId !== pointerId) return;
            const dx = e.clientX - dragStartX;
            dragDistance = Math.max(dragDistance, Math.abs(dx));
            if (!captured && dragDistance > DRAG_THRESHOLD) {
                // Capture only once it's clearly a drag so plain clicks still reach the cards.
                viewport.setPointerCapture(e.pointerId);
                viewport.dataset.dragging = "true";
                captured = true;
            }

            let next = dragStartPos - dx / pxPerCard;
            if (next < 0) next *= RUBBER_BAND;
            if (next > maxPos) next = maxPos + (next - maxPos) * RUBBER_BAND;

            const dt = e.timeStamp - lastMoveTime;
            if (dt > 0) {
                const instant = (-(e.clientX - lastX) / pxPerCard / dt) * FRAME_MS;
                vel = vel * 0.6 + instant * 0.4;
            }
            lastX = e.clientX;
            lastMoveTime = e.timeStamp;
            pos = next;
            render();
        };

        const onPointerUp = (e: PointerEvent) => {
            if (mode !== "drag" || e.pointerId !== pointerId) return;
            if (captured) viewport.releasePointerCapture(e.pointerId);
            delete viewport.dataset.dragging;
            pointerId = null;
            suppressClick = dragDistance > DRAG_THRESHOLD;
            // A pause before release means the user stopped — don't fling.
            if (e.timeStamp - lastMoveTime > 80) vel = 0;
            mode = "coast";
            wake();
        };

        const onClick = (e: MouseEvent) => {
            if (suppressClick) {
                suppressClick = false;
                return;
            }
            const card = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
            if (!card) return;
            const index = Number(card.dataset.index);
            if (index === Math.round(pos)) onSelectRef.current?.(items[index], index);
            else goTo(index);
        };

        const onWheel = (e: WheelEvent) => {
            const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (!horizontal && wheelAxis === "horizontal") return;
            const raw = horizontal ? e.deltaX : e.deltaY;
            const delta = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? raw * 16 : raw;
            // Let the page scroll on once the spiral has reached an end.
            if ((delta < 0 && pos <= 0.01) || (delta > 0 && pos >= maxPos - 0.01)) return;
            e.preventDefault();
            vel = clamp(vel + delta * 0.0022, -0.6, 0.6);
            mode = "coast";
            wake();
        };

        const onKeyDown = (e: KeyboardEvent) => {
            const current = mode === "snap" ? snapTarget : Math.round(pos);
            if (e.key === "ArrowRight") goTo(current + 1);
            else if (e.key === "ArrowLeft") goTo(current - 1);
            else if (e.key === "Home") goTo(0);
            else if (e.key === "End") goTo(maxPos);
            else if (e.key === "Enter" || e.key === " ") onSelectRef.current?.(items[current], current);
            else return;
            e.preventDefault();
        };

        const resizeObserver = new ResizeObserver(() => {
            layout();
            render();
        });

        layout();
        render();
        viewport.dataset.ready = "true";
        resizeObserver.observe(viewport);
        viewport.addEventListener("pointerdown", onPointerDown);
        viewport.addEventListener("pointermove", onPointerMove);
        viewport.addEventListener("pointerup", onPointerUp);
        viewport.addEventListener("pointercancel", onPointerUp);
        viewport.addEventListener("click", onClick);
        viewport.addEventListener("wheel", onWheel, { passive: false });
        viewport.addEventListener("keydown", onKeyDown);

        return () => {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            viewport.removeEventListener("pointerdown", onPointerDown);
            viewport.removeEventListener("pointermove", onPointerMove);
            viewport.removeEventListener("pointerup", onPointerUp);
            viewport.removeEventListener("pointercancel", onPointerUp);
            viewport.removeEventListener("click", onClick);
            viewport.removeEventListener("wheel", onWheel);
            viewport.removeEventListener("keydown", onKeyDown);
        };
    }, [items, wheelAxis]);

    const active = items[activeIndex];

    return (
        <section
            className={`${styles.root} ${className ?? ""}`}
            aria-roledescription="carousel"
            aria-label="Event posters"
        >
            <div
                ref={viewportRef}
                className={styles.viewport}
                tabIndex={0}
                aria-label="Drag, scroll or use the arrow keys to browse"
            >
                <div ref={sceneRef} className={styles.scene}>
                    {items.map((item, i) => (
                        <div
                            key={item.id}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            className={styles.card}
                            data-index={i}
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${items.length}: ${item.title}`}
                            aria-hidden={i !== activeIndex}
                        >
                            <div className={styles.body}>
                                <div className={`${styles.face} ${styles.front}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.imageUrl} alt={item.title} draggable={false} loading={i < 4 ? "eager" : "lazy"} />
                                    <span className={styles.cardTitle}>{item.title}</span>
                                </div>
                                <div className={`${styles.face} ${styles.back}`} aria-hidden="true">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.imageUrl} alt="" draggable={false} loading="lazy" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {active && (
                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={() => goToRef.current(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        aria-label="Previous poster"
                    >
                        &larr;
                    </button>
                    <div className={styles.caption} aria-live="polite">
                        <span className={styles.counter}>
                            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                        <span className={styles.activeTitle}>{active.title}</span>
                    </div>
                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={() => goToRef.current(activeIndex + 1)}
                        disabled={activeIndex === items.length - 1}
                        aria-label="Next poster"
                    >
                        &rarr;
                    </button>
                </div>
            )}
        </section>
    );
}
