import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventPageProps = {
    params: Promise<{
        eventSlug: string;
    }>;
};

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


    return (
        <main className="
      min-h-screen
      overflow-hidden
      bg-[#020408]
      text-white
    ">

            {/* ==================================================
          HERO
      ================================================== */}

            <section className="
        relative
        min-h-[75vh]
        overflow-hidden
        border-b
        border-[rgba(56,217,255,.1)]
      ">

                {/* Banner */}
                <div>
                    <Image
                        src={event.bannerLink.url}
                        alt={event.title}
                        width={300}
                        height={300}
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            opacity-45
                          "
                    />
                </div>
                {/* Main gradient */}

                <div className="
          absolute
          inset-0
          bg-[linear-gradient(90deg,#020408_0%,rgba(2,4,8,.92)_40%,rgba(2,4,8,.48)_100%)]
        " />

                {/* Bottom fade */}

                <div className="
          absolute
          inset-x-0
          bottom-0
          h-[45%]
          bg-gradient-to-t
          from-[#020408]
          to-transparent
        " />

                {/* Purple glow */}

                <div className="
          absolute
          right-[10%]
          top-[15%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#a855f7]
          opacity-[.08]
          blur-[140px]
        " />

                {/* Content */}
                <div className="
          relative
          z-10
          mx-auto
          flex
          min-h-[75vh]
          max-w-[1200px]
          items-end
          px-[5vw]
          pb-[85px]
          pt-[150px]
        ">

                    <div className="max-w-[850px]">

                        {/* Back */}

                        <Link
                            href="/cyber-month#events"
                            className="
                mb-10
                inline-flex
                font-mono
                text-[9px]
                uppercase
                tracking-[.15em]
                text-[#52645c]
                transition-colors
                hover:text-[#38d9ff]
              "
                        >
                            ← Back to Cyber Month
                        </Link>

                        {/* Status */}

                        <div className="
              mb-7
              flex
              flex-wrap
              items-center
              gap-3
              font-mono
              text-[9px]
              uppercase
              tracking-[.13em]
            ">

                            <span className="
                border
                border-[rgba(25,214,107,.35)]
                bg-[rgba(25,214,107,.05)]
                px-3
                py-1.5
                text-[#19d66b]
              ">
                                REGISTRATION OPEN
                            </span>

                            <span className="text-[#52615b]">
                //
                            </span>

                            <span className="text-[#38d9ff]">
                                {event.mode}
                            </span>

                        </div>

                        {/* Title */}

                        <h1 className="
              text-[clamp(55px,9vw,125px)]
              font-black
              uppercase
              leading-[.82]
              tracking-[-.085em]
            ">
                            {event.title}
                        </h1>

                        <p className="
              mt-8
              max-w-[650px]
              text-[15px]
              leading-[1.8]
              text-[#9aa7a2]
            ">
                            {event.description}
                        </p>

                    </div>

                    <div className="h-50 w-100 relative">

                    </div>
                </div>
            </section>

            {/* ==================================================
          EVENT INFORMATION
      ================================================== */}

            <section className="
        px-[5vw]
        py-[100px]
      ">
                <div>
                    <Image
                        src={event.bannerLink.url}
                        alt={event.title}
                        width={300}
                        height={100}
                        className="z-10 absolute right-24 top-20"
                        style={event.bannerLink.width === event.bannerLink.height ? {top : '140px'} : {top : '80px'}}
                    />
                </div>

                <div className="
          mx-auto
          grid
          max-w-[1200px]
          grid-cols-1
          gap-[70px]
          lg:grid-cols-[1fr_350px]
        ">

                    {/* LEFT */}

                    <div>

                        <div className="
              mb-8
              font-mono
              text-[10px]
              uppercase
              tracking-[.16em]
              text-[#19d66b]
            ">
                            EVENT // MISSION BRIEF
                        </div>

                        <h2 className="
              text-[clamp(35px,5vw,60px)]
              leading-[.9]
              tracking-[-.06em]
            ">
                            Enter the
                            <span className="
                ml-2
                bg-gradient-to-r
                from-[#a855f7]
                to-[#38d9ff]
                bg-clip-text
                text-transparent
              ">
                                mission.
                            </span>
                        </h2>

                        <div className="
              mt-8
              max-w-[700px]
              text-[14px]
              leading-[2]
              text-[#7d8b85]
            ">
                            <p>
                                {event.description}
                            </p>

                            <p className="mt-5">
                                Join the AVCD Computer Society community
                                as we explore cybersecurity, technology
                                and the challenges shaping our digital future.
                            </p>
                        </div>

                        {/* Terminal-style event info */}

                        <div className="
              mt-12
              border
              border-[rgba(25,214,107,.15)]
              bg-[#030806]
            ">

                            <div className="
                border-b
                border-[rgba(25,214,107,.1)]
                px-5
                py-3
                font-mono
                text-[8px]
                uppercase
                tracking-[.14em]
                text-[#19d66b]
              ">
                                mission_parameters
                            </div>

                            <div className="p-5">

                                {[
                                    [
                                        "START",
                                        `${formatDate(event.startDate)} // ${formatTime(event.startDate)}`,
                                    ],
                                    [
                                        "END",
                                        `${formatDate(event.endDate)} // ${formatTime(event.endDate)}`,
                                    ],
                                    [
                                        "MODE",
                                        event.mode,
                                    ],
                                    [
                                        "LOCATION",
                                        event.location || "ONLINE",
                                    ],
                                    [
                                        "ACCESS",
                                        event.paymentDetails,
                                    ],
                                ].map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="
                      grid
                      grid-cols-[100px_1fr]
                      border-b
                      border-[rgba(255,255,255,.045)]
                      py-4
                      font-mono
                      text-[9px]
                      last:border-0
                    "
                                    >
                                        <span className="text-[#43534d]">
                                            {key}
                                        </span>

                                        <span className="text-[#b4c0bc]">
                                            {value}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <aside>

                        <div className="
              sticky
              top-[110px]
              border
              border-[rgba(56,217,255,.16)]
              bg-[#05090b]
              p-6
              shadow-[0_20px_70px_rgba(0,0,0,.3)]
            ">

                            <div className="
                mb-6
                font-mono
                text-[9px]
                uppercase
                tracking-[.15em]
                text-[#52615b]
              ">
                                ACCESS // REGISTRATION
                            </div>

                            <div className="
                mb-6
                flex
                items-center
                gap-3
                font-mono
                text-[9px]
                text-[#19d66b]
              ">
                                <span className="
                  h-[6px]
                  w-[6px]
                  rounded-full
                  bg-[#19d66b]
                  shadow-[0_0_12px_#19d66b]
                " />

                                REGISTRATION OPEN
                            </div>

                            <a
                                href={event.formLink}
                                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  bg-gradient-to-r
                  from-[#19d66b]
                  to-[#32ff88]
                  px-5
                  py-4
                  font-mono
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[.08em]
                  text-[#021009]
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-[0_10px_35px_rgba(25,214,107,.18)]
                "
                            >
                                Register for Event ↗
                            </a>

                            <div className="
                mt-6
                border-t
                border-[rgba(255,255,255,.06)]
                pt-6
              ">

                                <div className="
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[.13em]
                  text-[#3f4d48]
                ">
                                    CONTACT
                                </div>

                                <div className="
                  mt-2
                  break-all
                  text-[10px]
                  text-[#7c8984]
                ">
                                    {event.contactDetails}
                                </div>

                            </div>

                            <div className="
                mt-5
                border-t
                border-[rgba(255,255,255,.06)]
                pt-5
              ">

                                <div className="
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[.13em]
                  text-[#3f4d48]
                ">
                                    ACCESS
                                </div>

                                <div className="
                  mt-2
                  text-[11px]
                  text-[#19d66b]
                ">
                                    {event.paymentDetails}
                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </section>

            {/* ==================================================
          FOOTER
      ================================================== */}

            <footer className="
        border-t
        border-[rgba(255,255,255,.06)]
        px-[5vw]
        py-7
        font-mono
        text-[8px]
        uppercase
        tracking-[.1em]
        text-[#45534e]
      ">

                AVCD COMPUTER SOCIETY // CYBER MONTH 2026

            </footer>

        </main>
    );
}