"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type CyberIntroProps = {
  onComplete: () => void;
};

const PRESENTS = "BMSCE IEEE COMPUTER SOCIETY PRESENTS";
const NETWORK_PROMPT = "ENTER THE NETWORK";

export default function CyberIntro({ onComplete }: CyberIntroProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [typed, setTyped] = useState("");
  const [eyeVisible, setEyeVisible] = useState(false);
  const [networkVisible, setNetworkVisible] = useState(false);
  const [networkTyped, setNetworkTyped] = useState("");
  const [networkReady, setNetworkReady] = useState(false);
  const [cyberVisible, setCyberVisible] = useState(false);
  const [monthVisible, setMonthVisible] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const [entering, setEntering] = useState(false);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const typeDelay = reducedMotion ? 8 : 42;
    let cursor = 0;

    const typeTimer = window.setInterval(() => {
      cursor += 1;
      setTyped(PRESENTS.slice(0, cursor));
      if (cursor >= PRESENTS.length) {
        window.clearInterval(typeTimer);
        timers.push(window.setTimeout(() => setEyeVisible(true), reducedMotion ? 0 : 320));
        timers.push(window.setTimeout(() => setNetworkVisible(true), reducedMotion ? 0 : 1550));
      }
    }, typeDelay);

    return () => {
      window.clearInterval(typeTimer);
      timers.forEach(window.clearTimeout);
      if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!networkVisible) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const typeDelay = reducedMotion ? 8 : 34;
    const timers: number[] = [];
    let cursor = 0;
    const typeTimer = window.setInterval(() => {
      cursor += 1;
      setNetworkTyped(NETWORK_PROMPT.slice(0, cursor));
      if (cursor >= NETWORK_PROMPT.length) {
        window.clearInterval(typeTimer);
        setNetworkReady(true);
        timers.push(window.setTimeout(() => setCyberVisible(true), reducedMotion ? 0 : 280));
        timers.push(window.setTimeout(() => setMonthVisible(true), reducedMotion ? 0 : 580));
        timers.push(window.setTimeout(() => setCanEnter(true), reducedMotion ? 0 : 900));
      }
    }, typeDelay);

    return () => {
      window.clearInterval(typeTimer);
      timers.forEach(window.clearTimeout);
    };
  }, [networkVisible]);

  const enterWebsite = () => {
    if (!canEnter || entering) return;
    setEntering(true);
    enterTimer.current = window.setTimeout(onComplete, 820);
  };

  if (!portalRoot) return null;

  return createPortal((
    <div className={`intro-screen${entering ? " intro-screen-entering" : ""}`}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-vignette" aria-hidden="true" />
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-scanlines" aria-hidden="true" />

      <div className="intro-console" aria-label={`${PRESENTS} search console`}>
        <span className="intro-search-icon" aria-hidden="true">⌕</span>
        <span className="intro-console-text" aria-live="polite">{typed}{typed.length === PRESENTS.length ? "_" : ""}</span>
        <span className="intro-cursor" aria-hidden="true" />
        {canEnter && <span className="intro-console-arrow" aria-hidden="true">→</span>}
      </div>

      <div className="intro-center-stack">
        <div className={`eye-interface${eyeVisible ? " eye-interface-visible" : ""}`} aria-hidden="true">
          <div className="eye-orbit eye-orbit-outer" />
          <div className="eye-orbit eye-orbit-middle" />
          <div className="eye-orbit eye-orbit-inner" />
          <div className="eye-target-ring" />
          <span className="orbit-label orbit-label-one">01 / SCAN</span>
          <span className="orbit-label orbit-label-two">SYNC / 07</span>
          <span className="orbit-label orbit-label-three">SYSTEM ACTIVE</span>
          <div className="intro-eye">
            <Image className="eye-ghost eye-ghost-cyan" src="/eye.png" alt="" fill priority sizes="(max-width: 700px) 88vw, 64vw" />
            <Image className="eye-ghost eye-ghost-gold" src="/eye.png" alt="" fill priority sizes="(max-width: 700px) 88vw, 64vw" />
            <Image className="eye-main" src="/eye.png" alt="Cyber Month biometric eye interface" fill priority sizes="(max-width: 700px) 88vw, 64vw" />
          </div>
        </div>

        <button
          type="button"
          className={`intro-enter${networkVisible ? " intro-enter-visible" : ""}${entering ? " intro-enter-connecting" : ""}`}
          onClick={enterWebsite}
          disabled={!canEnter || entering}
          aria-label="Enter Cyber Month website"
        >
          <span className="intro-enter-search">
            <span aria-hidden="true">⌕</span>
            {entering ? "CONNECTING TO NETWORK" : networkTyped}
            {networkVisible && !networkReady && <i className="network-typing-cursor" aria-hidden="true" />}
            {networkReady && !entering && <i className="network-blink-cursor" aria-hidden="true" />}
          </span>
          {networkReady && <span className="intro-enter-arrow" aria-hidden="true">→</span>}
        </button>

        <div className="intro-title" aria-label="Cyber Month">
          <span className={`intro-title-cyber${cyberVisible ? " intro-word-visible" : ""}`}>
            CYBER
          </span>
          <span className={`intro-title-month${monthVisible ? " intro-word-visible" : ""}`}>
            MONTH
          </span>
        </div>
      </div>

      <style jsx global>{`
        .intro-screen {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #050409;
          color: #f5f1f6;
          isolation: isolate;
          transition: opacity .7s ease, transform .82s cubic-bezier(.2,.78,.2,1), filter .55s ease;
        }
        .intro-screen-entering {
          opacity: 0;
          filter: brightness(2.2) saturate(1.5);
          transform: scale(1.075);
          pointer-events: none;
        }
        .intro-grid, .intro-vignette, .intro-grain, .intro-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .intro-grid {
          opacity: .18;
          background-image: linear-gradient(rgba(255,43,214,.11) 1px, transparent 1px), linear-gradient(90deg, rgba(92,242,255,.09) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse at center, #000, transparent 78%);
        }
        .intro-vignette { background: radial-gradient(ellipse at center, transparent 22%, rgba(5,4,9,.45) 76%, #050409 100%); }
        .intro-grain {
          opacity: .08;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.45'/%3E%3C/svg%3E");
        }
        .intro-scanlines { opacity: .13; background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(232,225,244,.05) 4px, transparent 5px); }
        .intro-console {
          position: absolute;
          z-index: 6;
          top: max(9vh, 54px);
          left: 50%;
          display: flex;
          width: min(760px, calc(100vw - 38px));
          min-height: 54px;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          transform: translateX(-50%);
          border: 1px solid rgba(255,43,214,.35);
          background: rgba(8,6,14,.8);
          box-shadow: 0 0 35px rgba(255,43,214,.07), inset 0 0 25px rgba(92,242,255,.025);
          backdrop-filter: blur(10px);
          font: 500 clamp(8px, 1.15vw, 11px)/1.4 var(--mono), monospace;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .intro-search-icon { color: #5cf2ff; font-size: 24px; line-height: 1; }
        .intro-console-text { overflow: hidden; color: #eae2ee; white-space: nowrap; }
        .intro-cursor { width: 7px; height: 16px; flex: 0 0 7px; background: #ff2bd6; animation: cursor-blink .78s steps(1) infinite; }
        .intro-console-arrow { margin-left: auto; color: #5cf2ff; font-size: 20px; animation: arrow-pulse 1.25s ease-in-out infinite; }
        .intro-eye {
          position: absolute;
          z-index: 2;
          top: 22%;
          left: 50%;
          width: min(65vw, 850px);
          aspect-ratio: 2.4 / 1;
          opacity: 0;
          transform: translate(-50%, 15px) scale(.96);
          filter: brightness(.78) saturate(.7) contrast(1.08);
          transition: opacity 1.1s ease, transform 1.5s cubic-bezier(.2,.7,.2,1);
        }
        .intro-eye-visible { opacity: 1; transform: translate(-50%, 0) scale(1); animation: eye-glitch 6.2s steps(1) 1.8s infinite; }
        .intro-eye :global(img) { object-fit: contain; }
        .eye-main { z-index: 3; }
        .eye-ghost { z-index: 1; opacity: .28; mix-blend-mode: screen; }
        .eye-ghost-cyan { filter: sepia(1) saturate(8) hue-rotate(135deg); transform: translateX(-3px); }
        .eye-ghost-pink { filter: sepia(1) saturate(10) hue-rotate(270deg); transform: translateX(3px); }
        .intro-title {
          position: absolute;
          z-index: 5;
          top: 64%;
          left: 50%;
          display: flex;
          width: min(100%, 1160px);
          justify-content: center;
          gap: clamp(12px, 5vw, 72px);
          transform: translateX(-50%);
          font: 700 clamp(44px, 9.5vw, 126px)/.88 var(--font-chakrapetch), sans-serif;
          letter-spacing: .035em;
          white-space: nowrap;
        }
        .intro-title-cyber, .intro-title-month { opacity: 0; transition: opacity .42s ease, transform .8s cubic-bezier(.2,.7,.2,1); }
        .intro-title-cyber { color: #f3eff5; transform: translateX(-24px); text-shadow: 3px 0 rgba(92,242,255,.32); }
        .intro-title-month { color: #ff2bd6; transform: translateX(24px); text-shadow: -3px 0 rgba(92,242,255,.26); }
        .intro-word-visible { opacity: 1; transform: translateX(0); }
        .intro-enter {
          position: absolute;
          z-index: 7;
          bottom: 9%;
          left: 50%;
          display: flex;
          min-height: 48px;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(92,242,255,.42);
          padding: 0 20px;
          transform: translate(-50%, 9px);
          background: rgba(10,8,17,.55);
          color: #c5faff;
          cursor: pointer;
          font: 500 9px var(--mono), monospace;
          letter-spacing: .2em;
          opacity: 0;
          transition: opacity .4s ease, transform .4s ease, border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .intro-enter-visible { transform: translate(-50%, 0); opacity: 1; }
        .intro-enter:hover, .intro-enter:focus-visible { border-color: #ff2bd6; outline: none; background: rgba(255,43,214,.08); box-shadow: 0 0 24px rgba(255,43,214,.18); }
        .intro-enter:disabled { cursor: default; }
        .intro-enter-arrow { color: #5cf2ff; font-size: 17px; transition: transform .2s ease; }
        .intro-enter:hover .intro-enter-arrow { transform: translateX(4px); }
        @keyframes cursor-blink { 50% { opacity: 0; } }
        @keyframes arrow-pulse { 50% { opacity: .45; transform: translateX(3px); } }
        @keyframes eye-glitch {
          0%, 94%, 97%, 100% { transform: translate(-50%, 0) scale(1); }
          95% { transform: translate(calc(-50% - 5px), 1px) scale(1.004); }
          96% { transform: translate(calc(-50% + 4px), -1px) scale(.998); }
        }
        @media (max-width: 700px) {
          .intro-console { top: 7vh; min-height: 48px; gap: 8px; padding: 0 11px; letter-spacing: .07em; }
          .intro-search-icon { font-size: 20px; }
          .intro-eye { top: 27%; width: 90vw; }
          .intro-title { top: 62%; gap: 13px; font-size: clamp(39px, 11.3vw, 74px); }
          .intro-enter { bottom: 11%; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
        .intro-screen { background: #030508; color: #eef3f5; }
        .intro-screen-entering { filter: brightness(1.8) saturate(1.25) hue-rotate(8deg); transform: scale(1.1); }
        .intro-screen-entering::after { position: absolute; z-index: 20; inset: 0; pointer-events: none; content: ""; background: linear-gradient(110deg, transparent 28%, rgba(0,191,255,.32) 45%, rgba(240,201,106,.28) 52%, rgba(235,244,255,.72) 55%, transparent 70%); animation: enter-flash .82s ease-out both; }
        .intro-grid { opacity: .13; background-image: linear-gradient(rgba(0,191,255,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(214,168,79,.06) 1px, transparent 1px); }
        .intro-vignette { background: radial-gradient(ellipse at center, transparent 18%, rgba(3,5,8,.52) 75%, #030508 100%); }
        .intro-scanlines { opacity: .12; background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(203,222,231,.045) 4px, transparent 5px); }
        .intro-console { border-color: rgba(0,191,255,.34); background: rgba(5,9,14,.86); box-shadow: 0 0 35px rgba(0,191,255,.045), inset 0 0 25px rgba(214,168,79,.025); }
        .intro-search-icon { color: #00bfff; }
        .intro-console-text { color: #eef3f5; }
        .intro-cursor { background: #d6a84f; }
        .intro-console-arrow { color: #00bfff; }
        .eye-interface { position: absolute; z-index: 2; top: 18%; left: 50%; width: min(70vw, 760px); aspect-ratio: 1; opacity: 0; transform: translate(-50%, 18px) scale(.94); transition: opacity 1.1s ease, transform 1.5s cubic-bezier(.2,.7,.2,1); }
        .eye-interface-visible { opacity: 1; transform: translate(-50%, 0) scale(1); }
        .eye-orbit, .eye-target-ring { position: absolute; top: 50%; left: 50%; aspect-ratio: 1; border: 1px solid rgba(0,191,255,.15); border-radius: 50%; transform: translate(-50%, -50%); }
        .eye-orbit-outer { width: 96%; border-color: rgba(214,168,79,.12); animation: orbit-turn 90s linear infinite; }
        .eye-orbit-middle { width: 81%; border-style: dashed; border-color: rgba(0,191,255,.15); animation: orbit-turn 62s linear infinite reverse; }
        .eye-orbit-inner { width: 66%; border-color: rgba(214,168,79,.16); }
        .eye-target-ring { width: 58%; border-color: rgba(0,191,255,.12); border-style: dashed; }
        .orbit-label { position: absolute; z-index: 4; color: rgba(179,202,214,.43); font: 7px var(--mono), monospace; letter-spacing: .12em; }
        .orbit-label-one { top: 24%; right: 6%; }
        .orbit-label-two { bottom: 19%; left: 6%; color: rgba(214,168,79,.5); }
        .orbit-label-three { top: 51%; left: 1%; writing-mode: vertical-rl; }
        .intro-eye { position: absolute; top: 50%; left: 50%; width: 70%; aspect-ratio: 2.4 / 1; transform: translate(-50%, -50%); filter: brightness(.88) saturate(.85) contrast(1.06); animation: eye-glitch 8s steps(1) 2.6s infinite; }
        .eye-ghost { opacity: .18; mix-blend-mode: screen; }
        .eye-ghost-cyan { filter: sepia(1) saturate(7) hue-rotate(145deg); transform: translateX(-3px); }
        .eye-ghost-gold { filter: sepia(1) saturate(5) hue-rotate(350deg); transform: translateX(3px); }
        .intro-title-cyber { color: #edf3f5; text-shadow: 2px 0 rgba(0,191,255,.27); }
        .intro-title-month { color: #00bfff; text-shadow: -2px 0 rgba(240,201,106,.22); }
        .intro-enter { border-color: rgba(0,191,255,.4); background: rgba(5,9,14,.82); color: #c5dce6; }
        .intro-enter:hover, .intro-enter:focus-visible { border-color: #d6a84f; outline: 2px solid rgba(0,191,255,.42); outline-offset: 3px; background: rgba(0,191,255,.07); box-shadow: 0 0 24px rgba(0,191,255,.13); }
        .intro-enter-search { display: flex; align-items: center; gap: 10px; }
        .intro-enter-search > span:first-child { color: #00bfff; font-size: 20px; }
        .intro-enter-arrow { color: #d6a84f; }
        @keyframes orbit-turn { to { rotate: 360deg; } }
        @keyframes enter-flash { 0% { opacity: 0; transform: translateX(-100%); } 22% { opacity: 1; } 100% { opacity: 0; transform: translateX(100%); } }
        @keyframes eye-glitch { 0%, 94%, 97%, 100% { transform: translate(-50%, -50%) scale(1); } 95% { transform: translate(calc(-50% - 4px), calc(-50% + 1px)) scale(1.004); } 96% { transform: translate(calc(-50% + 3px), calc(-50% - 1px)) scale(.998); } }
        @media (max-width: 700px) { .eye-interface { top: 18%; width: min(94vw, 570px); } .intro-eye { top: 50%; width: 75%; } }
        .intro-grid, .intro-vignette, .intro-grain, .intro-scanlines { z-index: 1; }
        .intro-console { z-index: 30; }
        .intro-screen-entering::after { z-index: 40; }
        .intro-center-stack {
          position: absolute;
          z-index: 10;
          top: 54%;
          left: 50%;
          display: flex;
          width: 100%;
          align-items: center;
          flex-direction: column;
          gap: clamp(12px, 2vh, 22px);
          transform: translate(-50%, -50%);
          transition: transform .82s cubic-bezier(.2,.78,.2,1);
        }
        .intro-screen-entering .intro-center-stack { transform: translate(-50%, -50%) scale(1.08); }
        .eye-interface {
          position: relative;
          top: auto;
          left: auto;
          z-index: 10;
          width: min(56vw, 520px, 48vh);
          flex: 0 0 auto;
          aspect-ratio: 1;
          opacity: 0;
          transform: scale(.94);
          transition: opacity 1.1s ease, transform 1.4s cubic-bezier(.2,.7,.2,1);
        }
        .eye-interface-visible { opacity: 1; transform: scale(1); }
        .eye-orbit, .eye-target-ring { z-index: 10; }
        .orbit-label { z-index: 12; }
        .intro-eye {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 20;
          width: 72%;
          aspect-ratio: 2.4 / 1;
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%);
          filter: brightness(.96) saturate(.9) contrast(1.08) drop-shadow(0 0 20px rgba(0,191,255,.18));
        }
        .eye-interface-visible .intro-eye { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        .intro-eye::after {
          position: absolute;
          z-index: 25;
          inset: -8%;
          pointer-events: none;
          border-radius: 50%;
          content: "";
          background: radial-gradient(ellipse, rgba(0,191,255,.12), rgba(240,201,106,.05) 48%, transparent 73%);
          mix-blend-mode: screen;
        }
        .intro-eye :global(img) { object-fit: contain; object-position: center; }
        .eye-main { z-index: 3; }
        .eye-ghost { z-index: 1; }
        .intro-enter {
          position: relative;
          top: auto;
          bottom: auto;
          left: auto;
          z-index: 30;
          width: min(560px, 70vw);
          min-height: 54px;
          justify-content: space-between;
          gap: 14px;
          padding: 0 18px;
          transform: translateY(8px);
          border: 1px solid rgba(0,191,255,.58);
          background: linear-gradient(105deg, rgba(5,10,16,.94), rgba(8,12,17,.9));
          box-shadow: inset 0 0 0 1px rgba(240,201,106,.09), 0 0 22px rgba(0,191,255,.12), 0 0 42px rgba(0,191,255,.045);
          color: #e7f2f7;
          font-size: 10px;
          letter-spacing: .14em;
          opacity: 0;
          visibility: hidden;
          transition: opacity .5s ease, transform .5s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .intro-enter-visible { transform: translateY(0); opacity: 1; visibility: visible; }
        .intro-enter-search { min-width: 0; color: #e7f2f7; white-space: nowrap; }
        .intro-enter-search > span:first-child { color: #00d9ff; }
        .intro-enter-arrow { color: #f0c96a; }
        .intro-enter:hover, .intro-enter:focus-visible { border-color: #00d9ff; outline: 2px solid rgba(0,191,255,.32); outline-offset: 3px; box-shadow: inset 0 0 0 1px rgba(240,201,106,.16), 0 0 28px rgba(0,191,255,.2); }
        .network-typing-cursor, .network-blink-cursor { display: inline-block; width: 6px; height: 13px; margin-left: 4px; background: #d6a84f; vertical-align: -2px; animation: cursor-blink .78s steps(1) infinite; }
        .network-blink-cursor { background: #00d9ff; }
        .intro-title {
          position: relative;
          top: auto;
          left: auto;
          z-index: 31;
          width: min(100%, 1160px);
          flex: 0 0 auto;
          gap: clamp(12px, 5vw, 72px);
          transform: none;
          font-size: clamp(48px, 9vw, 116px);
        }
        .intro-title-cyber { color: #edf3f5; text-shadow: 2px 0 rgba(0,191,255,.27); }
        .intro-title-month { color: #00bfff; text-shadow: -2px 0 rgba(240,201,106,.22); }
        @media (max-width: 700px) {
          .intro-center-stack { top: 55%; gap: 12px; }
          .eye-interface { top: auto; width: min(84vw, 390px, 42vh); }
          .intro-eye { top: 50%; width: 75%; }
          .intro-enter { width: 85vw; min-height: 50px; padding: 0 13px; font-size: 9px; letter-spacing: .1em; }
          .intro-title { gap: 10px; font-size: clamp(42px, 11vw, 74px); }
        }
        @media (max-height: 680px) and (min-width: 701px) {
          .intro-center-stack { top: 56%; gap: 8px; }
          .eye-interface { width: min(42vw, 40vh, 420px); }
          .intro-title { font-size: clamp(44px, 7vw, 80px); }
          .intro-enter { min-height: 46px; }
        }
      `}</style>
    </div>
  ), portalRoot);
}
