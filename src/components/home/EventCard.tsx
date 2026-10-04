"use client";
import Image from "next/image";
import Link from "next/link";
import { CiCalendar } from "react-icons/ci";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}
function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function calculateDiff(date : Date){
    return date.getTime() - new Date().getTime() > 0;
}

type EventFromBDBriefBreif = {
    title: string;
    eventID: string;
    mode: "Offline" | "Online" | "Mixed";
    startDate: Date;
    endDate: Date;
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
    eventSlug: string;
}
export default function EventCard({ event }: { event: EventFromBDBriefBreif }) {
    return (
        <Link
            href={`/events/${event.eventSlug}`}
            className="group block"
        >
            <article
                className="
          relative overflow-hidden
          border border-[rgba(56,217,255,.12)]
          bg-[#05090b]
          transition-all duration-500
          hover:-translate-y-1
          hover:border-[rgba(168,85,247,.45)]
          hover:shadow-[0_20px_70px_rgba(168,85,247,.09)]
        "
            >
                {/* ---------------------------------------------
            IMAGE
        --------------------------------------------- */}
                <div className="relative px overflow-hidden p-5">
                    <Image
                        src={event.bannerLink.url}
                        alt={event.title}
                        sizes="h-auto w-auto"
                        width={200}
                        height={200}
                        className="
              h-full
              w-full
              object-cover
              opacity-75
              grayscale-[15%]
              transition-all duration-700
              group-hover:scale-[1.045]
              group-hover:opacity-90
            "
                    />
                    {/* Dark cyber overlay */}
                    <div
                        className="
              absolute inset-0
              bg:
              linear-gradient(
                180deg,
                rgba(2,4,8,.08) 0%,
                rgba(2,4,8,.25) 45%,
                rgba(2,4,8,.96) 100%
              )
            "
                    />
                    {/* Purple / cyan glow */}
                    <div className="
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-[#a855f7]
            opacity-10
            blur-[70px]
            transition-opacity
            group-hover:opacity-20
          " />
                    {/* Top metadata */}
                    <div className="
            absolute
            left-4
            right-4
            top-4
            flex
            items-center
            justify-between
          ">
                        {/* <span className="
              border
              border-[rgba(56,217,255,.3)]
              bg-[rgba(2,4,8,.65)]
              px-3
              py-1.5
              font-mono
              text-[8px]
              uppercase
              tracking-[.14em]
              text-[#38d9ff]
              backdrop-blur-md
            ">
                            {event.mode}
                        </span> */}
                        {/* <span className="
              flex
              items-center
              gap-2
              font-mono
              text-[8px]
              uppercase
              tracking-[.1em]
              text-[#19d66b]
            ">
                            <span className="
                h-[5px]
                w-[5px]
                rounded-full
                bg-[#19d66b]
                shadow-[0_0_10px_#19d66b]
              " />
                            LIVE REGISTRATION
                        </span> */}
                    </div>
                    {/* Scan line */}
                    <div className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-1/2
            h-px
            bg-gradient-to-r
            from-transparent
            via-[rgba(56,217,255,.35)]
            to-transparent
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          " />
                    {/* Date */}
                    {/* <div className="
            absolute
            bottom-5
            left-5
            font-mono
            text-[9px]
            uppercase
            tracking-[.13em]
            text-[#19d66b]
          ">
                        {formatDate(event.startDate)}
                        {" // "}
                        {formatTime(event.startDate)}
                    </div> */}
                </div>
                {/* ---------------------------------------------
            CARD CONTENT
        --------------------------------------------- */}
                <div className="p-5">
                    <div className="
            mb-3
            font-mono
            text-[8px]
            uppercase
            tracking-[.15em]
            text-[#52645c]
          ">
                        EVENT // {event.eventID.padStart(2, "0")}
                    </div>
                    <h3 className="
            text-[23px]
            font-medium
            leading-[1]
            tracking-[-.045em]
            text-white
            transition-colors
            group-hover:text-[#c084fc]
          ">
                        {event.title}
                    </h3>
                    <p className="
            mt-3
            line-clamp-2
            text-[11px]
            leading-[1.7]
            text-[#697871]
          ">
                        {event.description}
                    </p>
                    <div className="flex justify-between mt-2">
                        <div className="flex gap-2 items-center text-[#697871]">
                            <span><CiCalendar /></span>
                            <span>{formatDate(event.startDate)} {formatTime(event.startDate)}</span>
                        </div>
                        <span className=" border
              border-[rgba(56,217,255,.3)]
              bg-[rgba(2,4,8,.65)]
              px-3
              py-1.5
              font-mono
              text-[8px]
              uppercase
              tracking-[.14em]
              text-[#38d9ff]
              backdrop-blur-md">{event.mode}</span>
                    </div>
                    <div className="
            mt-6
            flex
            items-end
            justify-between
            border-t
            border-[rgba(255,255,255,.06)]
            pt-4
          ">
                        <div>
                            <div className="
                font-mono
                text-[7px]
                uppercase
                tracking-[.14em]
                text-[#43514c]
              ">
                                LOCATION
                            </div>
                            <div className="
                mt-1
                max-w-[160px]
                truncate
                text-[10px]
                text-[#87948f]
              ">
                                {event.location || "Online"}
                            </div>
                        </div>
                        {calculateDiff(event.startDate) ? <div>
                            <div className="
                                      flex
                                      items-center
                                      gap-2
                                      font-mono
                                      text-[16px]
                                      uppercase
                                      text-green
                                      transition-all
                                      group-hover:gap-3
                                    ">
                                Register Now
                                <span className="text-[13px]">
                                    ↗
                                </span>
                            </div>
                        </div> : <div className="flex
                                      items-center
                                      gap-2
                                      font-mono
                                      text-[16px]
                                      uppercase
                                      text-red/60
                                      transition-all
                                      group-hover:gap-3">Registeration Closed 
                            </div>}
                    </div>
                </div>
            </article>
        </Link>
    );
}