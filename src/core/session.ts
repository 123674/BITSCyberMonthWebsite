import { generateRandomNumber } from "@/func/passwordHasher";
import { redisClientforAuth } from "@/lib/redis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";
import { cache } from "react";

const COOKIE_NAME = "session_id";
const AUTH_COOKIE_NAME = "auth_session_id";
const AUTH_SESSION_EXPIRATION_SECONDS = 60 * 10;
const SESSION_EXPIRATION_SECONDS = 60 * 10 * 24 * 7;


const UserDataMiniSchema = z.object({
  adminID: z.string(),
  emailVerified: z.boolean(),
})

type UserDataMiniType = z.infer<typeof UserDataMiniSchema>

// Creating short lived Auth Session for Oauth cookie (no storing in redis)
export const createOAuthSession = async (response: NextResponse, state: string): Promise<void> => {
  response.cookies.set(AUTH_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    maxAge: AUTH_SESSION_EXPIRATION_SECONDS,
    path: "/",
  });
};

export const createUserResponseSession = async (userData: UserDataMiniType, response: NextResponse): Promise<void> => {
  const parsedData = UserDataMiniSchema.parse(userData);
  const sessionID = generateRandomNumber(512);
  await redisClientforAuth.set(`session:${sessionID}`, parsedData, {
    ex: SESSION_EXPIRATION_SECONDS
  });
  response.cookies.set(COOKIE_NAME, sessionID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    maxAge: SESSION_EXPIRATION_SECONDS,
    path: '/'
  })
}

// Get Auth Session from the browser
export const getOAuthFromSession = async (): Promise<string> => {
  const cookieStore = await cookies();
  const storedState = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return storedState ?? '';
};

// DELETE request to remove Auth session from the broswer 
export const removeOAuthFromSession = async (response: NextResponse): Promise<void> => {
  response.cookies.delete(AUTH_COOKIE_NAME);
}

export const getUserFromSession = cache(async (): Promise<UserDataMiniType | null> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId == null) return null;
  const rawUser = await redisClientforAuth.get(`session:${sessionId}`)
  const { success, data } = UserDataMiniSchema.safeParse(rawUser);
  return success ? data : null;

});

export const removeAuthFromSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId == null) return;
  await redisClientforAuth.del(`session:${sessionId}`);
  cookieStore.delete(COOKIE_NAME);
}