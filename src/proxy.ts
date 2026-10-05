// import { type NextRequest } from "next/server";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "./core/session";
import z from "zod";

const adminRoute = "/admin";

export const proxy = async (request: NextRequest) => {
    const response = await middlewareAuth(request) ?? NextResponse.next();
    return response;
}

async function middlewareAuth(request: NextRequest) {
    const callingUrl = request.nextUrl.pathname;
    const user = await getUserFromSession();
    if (callingUrl.startsWith(adminRoute)) {
        if (!user) {
            return NextResponse.redirect(new URL(`/signin`, request.url))
        }
        if (!user?.emailVerified) {
            return NextResponse.redirect(new URL(`/`, request.url))
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
