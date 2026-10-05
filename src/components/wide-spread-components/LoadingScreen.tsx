export default function LoadingScreen({ label = "Decrypting transmission" }: { label?: string }) {
    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black text-white">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(50,255,136,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(50,255,136,0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,#000_25%,transparent_75%)]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-bright/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* spinner ring */}
                <div className="relative size-14">
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-green-bright" />
                    <span className="absolute inset-2 animate-[spin_1.4s_linear_infinite_reverse] rounded-full border-2 border-transparent border-t-cyan" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-green-bright">
                    {"// "}{label}
                    <span className="animate-pulse">…</span>
                </p>
            </div>
        </main>
    );
}
