import Image from "next/image";
import Link from "next/link";
import { getEventStatus } from "@/components/home/Poster";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

type EventFromBDBriefBreif = {
    paymentDetails: string;
    title: string;
    formLink: string;
    contactDetails: string;
    mode: "Offline" | "Online" | "Mixed";
    description: string;
    location: string;
    bannerLink: {
        fileId: string;
        name: string;
        size: number;
        versionInfo: {
            id: string;
            name: string;
        } | null;
        filePath: string;
        url: string;
        fileType: string;
        height: number | null;
        width: number | null;
        thumbnailUrl: string | null;
        AITags: {
            name: string;
            confidence: number;
            source: string;
        }[] | null;
        description: string | null;
        orientation?: number | null | undefined;
    };
    publish: boolean;
    startDate: Date;
    eventSlug: string;
    endDate: Date;
    eventID: string;
}

export default async function EventPage({ event }: { event: EventFromBDBriefBreif }) {

    const status = getEventStatus(event.startDate, event.endDate);
    const registrationOpen = status === "upcoming";

    return (
        <main className="min-h-screen overflow-hidden bg-black text-white">

            {/* TOP STATUS BAR */}
            <div className="sticky top-0 z-30 border-b border-border-green bg-black/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-[5vw] py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-2">
                    <span className="flex items-center gap-2 text-green-bright">
                        <span className="size-1.5 animate-pulse rounded-full bg-green-bright" />
                        Live Feed
                    </span>
                    <span className="hidden sm:inline">//</span>
                    <span className="hidden sm:inline">event.detail.render</span>
                    <Link href="/#events" className="ml-auto text-muted-2 transition-colors hover:text-cyan">
                        ← Return to Grid
                    </Link>
                </div>
            </div>

            {/* ================= HERO ================= */}
            

            {/* MARQUEE */}
            

            {/* ================= MISSION BRIEF ================= */}
            <section className="relative px-[5vw] py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-end gap-4 border-b border-border-green pb-4">
                        {/* <span className="font-headings text-7xl font-bold leading-none text-white/10">01</span> */}
                        <div>
                            <h2 className="font-headings text-3xl font-bold tracking-tight text-green-bright">{event.title}</h2>
                            {/* <p className="font-mono text-[11px] uppercase tracking-widest text-muted-2">{"// decode the operation"}</p> */}
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
                        <div>
                            <p className="max-w-[700px] text-base leading-[2] text-muted">
                                {event.description}
                            </p>

                            <div className="mt-12 overflow-hidden rounded-xl border border-border-green shadow-[0_0_60px_rgba(50,255,136,0.12)]">
                                <div className="flex items-center gap-2 border-b border-border-green bg-black-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-green-bright">
                                    <span className="size-1.5 animate-pulse rounded-full bg-green-bright" />
                                    mission_parameters
                                </div>
                                <div className="bg-black-2 px-5 pb-5">
                                    {[
                                        ["START", `${formatDate(event.startDate)} // ${formatTime(event.startDate)}`],
                                        ["END", `${formatDate(event.endDate)} // ${formatTime(event.endDate)}`],
                                        ["MODE", event.mode],
                                        ["LOCATION", event.location || "ONLINE"],
                                        ["ACCESS", event.paymentDetails],
                                    ].map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-[110px_1fr] border-b border-white/5 py-4 font-mono text-[11px] last:border-0">
                                            <span className="text-muted-2">{key}</span>
                                            <span className="text-white/80">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="overflow-hidden rounded-xl border border-border-green">
                                <Image
                                    src={event.bannerLink.url}
                                    alt={event.title}
                                    width={event.bannerLink.width ?? 800}
                                    height={event.bannerLink.height ?? 500}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                            <div className="rounded-xl border border-border-green bg-black-2 p-6">
                                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-2">Contact</div>
                                <div className="mt-2 break-all text-sm text-muted">{event.contactDetails}</div>
                            </div>

                            {registrationOpen ? (
                                <a
                                    href={event.formLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-green-bright px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(50,255,136,0.6)]"
                                >
                                    Register for Event ↗
                                </a>
                            ) : (
                                <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-2">
                                    {status === "ongoing" ? "// registration closed — live now" : "// registration closed — archived"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= ACCESS ================= */}
            {/* <section className="relative border-t border-border-green px-[5vw] py-24">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,255,136,0.06),transparent_60%)]" />
                <div className="relative mx-auto max-w-4xl text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-green-bright">{"// final_transmission"}</p>
                    <h2 className="mt-4 font-headings text-[clamp(36px,6vw,72px)] font-bold leading-none tracking-tight">
                        Ready to <span className="text-green-bright drop-shadow-[0_0_25px_rgba(50,255,136,0.45)]">join the grid?</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-muted">
                        Secure your slot before the window closes. One form submission and you are in.
                    </p>
                    {registrationOpen ? (
                        <a
                            href={event.formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 inline-block rounded-md bg-green-bright px-12 py-5 font-mono text-sm font-bold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(50,255,136,0.6)]"
                        >
                            Register for Event ↗
                        </a>
                    ) : (
                        <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-muted-2">
                            {status === "ongoing" ? "// this mission is live now" : "// this mission is archived"}
                        </p>
                    )}
                </div>
            </section> */}

            <footer className="border-t border-border-green px-[5vw] py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">
                BMSCE IEEE COMPUTER SOCIETY // CYBER MONTH 2026
            </footer>
        </main>
    );
}
