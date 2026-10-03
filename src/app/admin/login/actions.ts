"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    ADMIN_COOKIE,
    ADMIN_SESSION_SECONDS,
    checkAdminCredentials,
    createAdminSessionToken,
} from "@/lib/adminAuth";

export type LoginState = { error: string | null };

// Only redirect back to admin pages on this site (blocks open redirects like "//evil.com").
const safeNextPath = (next: unknown): string =>
    typeof next === "string" && /^\/admin(\/|\?|$)/.test(next) && !next.startsWith("/admin/login")
        ? next
        : "/admin";

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!checkAdminCredentials(username, password)) {
        // Small delay slows down password guessing.
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { error: "Wrong username or password." };
    }

    const token = await createAdminSessionToken();
    if (!token) return { error: "Admin login is not configured on the server." };

    (await cookies()).set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ADMIN_SESSION_SECONDS,
    });

    redirect(safeNextPath(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
    (await cookies()).delete(ADMIN_COOKIE);
    redirect("/admin/login");
}
