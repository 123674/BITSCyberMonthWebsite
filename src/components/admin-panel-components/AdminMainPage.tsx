"use client";
import { logOutUser } from '@/core/user';
import { IEEE_CS_SOCIETY } from '@/lib/contants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import Poster from '../home/Poster';

type EventsDataType = {
    title: string,
    eventID: string,
    mode: "Offline" | "Online" | "Mixed",
    startDate: Date,
    endDate: Date,
    bannerLink: {
        fileId: string,
        name: string,
        size: number,
        versionInfo: {
            id: string,
            name: string,
        } | null,
        filePath: string,
        url: string,
        fileType: string,
        height: number | null,
        width: number | null,
        thumbnailUrl: string | null,
        AITags: {
            name: string;
            confidence: number,
            source: string,
        }[] | null,
        description: string | null,
        orientation?: number | null | undefined,
    },
    eventSlug: string,
    description?: string,
    location?: string,
}[]

function MoreMenu({ eventSlug }: { eventSlug: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div ref={ref} className="absolute -top-3 -right-3 z-30">
            <button
                type="button"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/60 font-mono text-xs tracking-widest text-white/80 backdrop-blur-sm transition-colors hover:border-green-bright/60 hover:text-green-bright"
            >
                •••
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute top-11 right-0 w-40 overflow-hidden rounded-lg border border-border-green bg-black-2 shadow-[0_0_30px_rgba(177,77,255,0.2)]"
                >
                    <Link
                        role="menuitem"
                        href={`/admin/update?event=${eventSlug}`}
                        className="block px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-white/80 transition-colors hover:bg-green-bright/10 hover:text-green-bright"
                    >
                        Edit
                    </Link>
                    <button
                        role="menuitem"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); console.log("delete requested for", eventSlug); setOpen(false); }}
                        className="block w-full cursor-pointer px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-red transition-colors hover:bg-red/10 hover:text-red"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

const AdminMainPage = ({ eventsData }: { eventsData: EventsDataType }): React.JSX.Element => {
    const [eventDataState] = useState(eventsData);

    return (
        <main className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-20 border-b border-border-green bg-black/80 px-4 py-3 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center gap-3">
                    <Image
                        src={IEEE_CS_SOCIETY}
                        alt="IEEE Computer Society Logo"
                        width={42}
                        height={42}
                    />
                    <h5 className="font-headings text-lg font-semibold tracking-tight text-white">
                        BMSCE <span className="text-green-bright">IEEE COMPUTER SOCIETY</span>
                    </h5>
                    <button
                        onClick={() => logOutUser()}
                        className="ml-auto cursor-pointer rounded-md border border-red/40 bg-red/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-red transition-colors hover:bg-red/20"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <section className="mx-auto mt-12 flex max-w-6xl items-end justify-between px-[6vw]">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-green-bright">{"// admin_console"}</p>
                    <h1 className="mt-2 font-headings text-3xl font-bold tracking-tight">Your Events</h1>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-2">[{eventDataState.length} missions tracked]</p>
                </div>
                <Link
                    href="/admin/add"
                    className="rounded-md bg-green-bright px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(177,77,255,0.5)]"
                >
                    + Create
                </Link>
            </section>

            <div className="mx-auto max-w-6xl px-[6vw] pb-24">
                {eventDataState.length ? (
                    <div className="mt-10 flex flex-wrap gap-6">
                        {eventDataState.map(ele => (
                            <div key={ele.eventID} className="relative">
                                <Poster event={ele} clickHandler={() => {}} />
                                <MoreMenu eventSlug={ele.eventSlug} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-16 text-center font-mono text-xs uppercase tracking-widest text-muted-2">
                        {"// no events detected in the grid"}
                    </p>
                )}
            </div>
        </main>
    )
}

export default AdminMainPage
