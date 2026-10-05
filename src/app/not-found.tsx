import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-6 text-white">
            {/* grid backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(50,255,136,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(50,255,136,0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,#000_25%,transparent_75%)]" />
            <div className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-green-bright/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-1/4 right-1/4 size-96 rounded-full bg-red/10 blur-3xl" />

            {/* HUD corners */}
            <span className="absolute left-6 top-6 h-8 w-8 border-l-2 border-t-2 border-red/60" />
            <span className="absolute right-6 top-6 h-8 w-8 border-r-2 border-t-2 border-red/60" />
            <span className="absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-red/60" />
            <span className="absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-red/60" />

            <div className="relative z-10 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-red">
                    {"// signal_lost"}
                </p>
                <h1 className="mt-4 font-headings text-[clamp(90px,18vw,220px)] font-bold leading-none tracking-tight text-white">
                    <span className="drop-shadow-[4px_0_0_rgba(56,217,255,0.5)] drop-shadow-[-4px_0_0_rgba(255,77,94,0.6)]">
                        404
                    </span>
                </h1>
                <h2 className="mt-2 font-headings text-2xl font-semibold uppercase tracking-widest text-green-bright">
                    Page not found
                </h2>
                <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
                    The node you requested does not exist on the grid. It may have been
                    moved, deleted, or never breached at all.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-md bg-green-bright px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(50,255,136,0.6)]"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/#events"
                        className="rounded-md border border-white/15 bg-white/5 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-white/80 transition-colors hover:border-green-bright/50 hover:text-green-bright"
                    >
                        Browse Events
                    </Link>
                </div>

                <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-2">
                    {"ERR::NODE_UNREACHABLE // BMSCE IEEE COMPUTER SOCIETY"}
                </p>
            </div>
        </main>
    );
}
