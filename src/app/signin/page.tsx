import Link from 'next/link'
import React from 'react'

const page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const resolvedParams = await searchParams;
  const callbackUrl = resolvedParams.callbackUrl || '/home';
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(177,77,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(177,77,255,0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/4 top-20 size-80 rounded-full bg-green-bright/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 size-80 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-border-green bg-black-2/80 p-10 text-center shadow-[0_0_60px_rgba(177,77,255,0.12)] backdrop-blur-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-green-bright">
          {"// secure_access"}
        </p>
        <h1 className="mt-4 font-headings text-3xl font-bold tracking-tight">
          Admin <span className="text-green-bright">Sign In</span>
        </h1>
        <p className="mt-3 text-sm text-muted">
          Authenticate to jack into the mission control console.
        </p>
        <Link
          href={`/api/auth/google?callback=${callbackUrl}`}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-green-bright px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(177,77,255,0.5)]"
        >
          Sign In With Google ↗
        </Link>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-2">
          BMSCE IEEE Computer Society
        </p>
      </div>
    </div>
  )
}

export default page
