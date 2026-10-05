"use client";

import { useEffect } from "react";

const TEXT_SELECTOR = "h2, h3, h4, p, li, blockquote, dt, dd";
// Areas that already animate themselves or whose text changes while open.
const SKIP_SELECTOR = "#home, header, dialog, [aria-hidden='true'], [data-no-text-reveal]";
const STAGGER_MS = 80;
const MAX_STAGGER_STEPS = 6;

type RevealKind = "words" | "type" | "slide";

// Small uppercase mono labels get typed out; headings rise word by word; the rest slides in.
function kindOf(el: HTMLElement): RevealKind {
    if (el.tagName === "H2") return "words";
    const style = getComputedStyle(el);
    if (style.textTransform === "uppercase" && parseFloat(style.fontSize) <= 13 && (el.textContent ?? "").length <= 60) {
        return "type";
    }
    return "slide";
}

// Wraps each word of a static heading in a masked span so words can rise one after another.
function splitWords(el: HTMLElement) {
    let index = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

    for (const node of textNodes) {
        const parts = (node.nodeValue ?? "").split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
                fragment.append(part);
                continue;
            }
            // Custom elements, not <span>, so page rules like `h2 span { color }` don't restyle every word.
            const mask = document.createElement("tr-mask");
            mask.className = "tr-word-mask";
            const word = document.createElement("tr-word");
            word.className = "tr-word";
            word.style.setProperty("--w", String(index++));
            word.textContent = part;
            mask.append(word);
            fragment.append(mask);
        }
        node.replaceWith(fragment);
    }
}

// Styles live in src/app/globals.css (scroll text reveal).
// Render it inside a page component (not a layout) so it runs only after that page has
// hydrated — splitting heading text before hydration causes a mismatch.
// Scroll-triggered entrance for text across the site: headings, labels, paragraphs and lists.
// Uses data attributes (not classes) so React re-renders never strip the state.
export default function ScrollTextReveal() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const observer = new IntersectionObserver(
            (entries) => {
                let step = 0;
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const el = entry.target as HTMLElement;
                    el.style.setProperty("--tr-delay", `${Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
                    el.dataset.textReveal = "in";
                    observer.unobserve(el);
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
        );

        const observed = new WeakSet<Element>();
        const prepare = (root: ParentNode) => {
            root.querySelectorAll<HTMLElement>(TEXT_SELECTOR).forEach((el) => {
                // Already prepared by an earlier mount (e.g. StrictMode re-run): just observe it again.
                if (el.dataset.textReveal === "pending" && !observed.has(el)) {
                    observed.add(el);
                    observer.observe(el);
                    return;
                }
                if (el.dataset.textReveal || el.closest(SKIP_SELECTOR)) return;
                // Skip nested matches (e.g. a <p> inside an <li>) so text isn't animated twice.
                if (el.parentElement?.closest(TEXT_SELECTOR)) return;
                if (!(el.textContent ?? "").trim()) return;
                const kind = kindOf(el);
                if (kind === "words") splitWords(el);
                if (kind === "type") el.style.setProperty("--chars", String(Math.max(4, (el.textContent ?? "").length)));
                el.dataset.textKind = kind;
                el.dataset.textReveal = "pending";
                observed.add(el);
                observer.observe(el);
            });
        };

        prepare(document.body);

        // Pick up text rendered later (filtered event cards, client navigation).
        let queued = 0;
        const mutations = new MutationObserver(() => {
            if (queued) return;
            queued = requestAnimationFrame(() => {
                queued = 0;
                prepare(document.body);
            });
        });
        mutations.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutations.disconnect();
            cancelAnimationFrame(queued);
        };
    }, []);

    return null;
}
