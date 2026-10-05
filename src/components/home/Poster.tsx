import Image from "next/image";
import Link from "next/link";

type Event = {
    title: string;
    eventID: string;
    mode: "Offline" | "Online" | "Mixed";
    startDate: Date;
    endDate: Date;
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
    eventSlug: string;
    description: string;
    location: string;
}

export type EventStatus = "upcoming" | "ongoing" | "completed";

export function getEventStatus(startDate: Date, endDate?: Date): EventStatus {
    const now = new Date().getTime();
    if (now < startDate.getTime()) return "upcoming";
    if (endDate && now > endDate.getTime()) return "completed";
    return endDate ? "ongoing" : "completed";
}

type PosterEvent = Pick<
    Event,
    "title" | "eventID" | "mode" | "startDate" | "bannerLink" | "eventSlug"
> & { endDate?: Date; description?: string; location?: string };

const statusStyles: Record<EventStatus, { label: string; dot: string; chip: string; cta: string }> = {
    upcoming: {
        label: "Registration Open",
        dot: "bg-green-bright",
        chip: "border-green-bright/50 bg-green-bright/10 text-green-bright",
        cta: "bg-green-bright text-black hover:shadow-[0_0_22px_rgba(177,77,255,0.6)]",
    },
    ongoing: {
        label: "Live Now",
        dot: "bg-cyan",
        chip: "border-cyan/50 bg-cyan/10 text-cyan",
        cta: "border border-cyan/60 bg-cyan/10 text-cyan hover:shadow-[0_0_22px_rgba(31,182,255,0.5)]",
    },
    completed: {
        label: "Completed",
        dot: "bg-muted",
        chip: "border-white/15 bg-white/5 text-muted",
        cta: "border border-white/20 bg-white/5 text-white/70",
    },
};

export default function Poster({ event, clickHandler }: { event: PosterEvent, clickHandler: () => void }) {
    const status = getEventStatus(event.startDate, event.endDate);
    const style = statusStyles[status];
    // Registration is open only while the current time is before the event start.
    const registrationOpen = new Date().getTime() < event.startDate.getTime();

    return (
        <article
            onClick={clickHandler}
            className="group relative flex w-[min(80vw,300px)] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-deep-green/80 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-green-bright/60 hover:shadow-[0_0_40px_rgba(177,77,255,0.25)] focus-visible:outline-2 focus-visible:outline-green-bright"
        >
            {/* HUD corner brackets */}
            {/* <span className="pointer-events-none absolute left-0 top-0 z-10 h-4 w-4 border-l-2 border-t-2 border-green-bright/70" />
            <span className="pointer-events-none absolute right-0 top-0 z-10 h-4 w-4 border-r-2 border-t-2 border-green-bright/70" />
            <span className="pointer-events-none absolute bottom-0 left-0 z-10 h-4 w-4 border-b-2 border-l-2 border-green-bright/70" />
            <span className="pointer-events-none absolute bottom-0 right-0 z-10 h-4 w-4 border-b-2 border-r-2 border-green-bright/70" /> */}

            {/* Poster */}
            <div className="relative aspect-3/2 w-full overflow-hidden">
                <div className="bg-deep-green p-2">
                    <Image
                        src={event.bannerLink.url}
                        width={300}
                        height={200}
                        alt={`${event.title} poster`}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-101"
                        sizes="(max-width: 640px) 90vw, 300px"
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-deep-green via-transparent to-transparent" />
                <div className={`absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm ${style.chip}`}>
                    <span className={`size-1.5 rounded-full ${style.dot} ${status !== "completed" ? "animate-pulse" : ""}`} />
                    {style.label}
                </div>
                <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-sm">
                    {event.mode}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 font-headings text-lg font-bold leading-snug text-white">
                    {event.title}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-green-bright">
                    {event.startDate.toDateString()}{event.location ? ` · ${event.location}` : ""}
                </p>
                {event.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
                        {event.description}
                    </p>
                )}
                <Link
                    href={`/event/${event.eventSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-4 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${style.cta}`}
                >
                    {registrationOpen ? "Register Now" : status === "ongoing" ? "Join Stream" : "View Details"}
                    <span aria-hidden="true">-&gt;</span>
                </Link>
            </div>
        </article>
    );
}
