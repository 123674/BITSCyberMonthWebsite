import { IEEE_CS_SOCIETY } from '@/lib/contants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="cyber-shell">
      <nav aria-label="Main navigation" className="cyber-nav fixed left-0 right-0 top-0 z-100 flex h-19.5 items-center justify-between border-b border-[rgba(56,217,255,0.08)] bg-[rgba(2,4,8,0.72)] px-[5vw] backdrop-blur-[20px]">
        <Link href="/#hero" className="flex items-center gap-3">
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
            <div className="text-[13px] font-bold tracking-[-0.02em] text-white ">
              BMSCE IEEE COMPUTER SOCIETY
            </div>
            <span className="mt-0.75 block font-mono text-[8px] uppercase tracking-[0.13em] text-cyan">
              Cyber Month // 2026
            </span>
          </div>
        </Link>
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
        <details className="cyber-mobile-menu lg:hidden">
          <summary aria-label="Open navigation menu">MENU <span>+</span></summary>
          <div className="cyber-mobile-links">
            <Link href="/#hero">HOME</Link>
            <Link href="/#events">EVENTS</Link>
            <Link href="/#about">ABOUT</Link>
            <Link href="/#hackathon">HACKATHON</Link>
            <Link href="/#contact">CONTACT</Link>
          </div>
        </details>
      </nav>
      {children}
    </div>
  )
}

export default layout