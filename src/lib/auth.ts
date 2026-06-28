import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const [session] =
    await sql`SELECT user_id, expires_at FROM sessions WHERE id = ${token}`;
  if (!session) return null;
  const expireDate = new Date(session.expires_at);
  const currentDate = new Date();
  if (expireDate < currentDate) return null;
  const [user] =
    await sql`SELECT id, email FROM users WHERE id = ${session.user_id}`;
  if (!user) return null;
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 },
      ),
    };
  }
  return { user, response: null };
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function buildExpiry() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

// full helper for the simple (non-transactional) case — login uses this
export async function createSession(userId: string) {
  const token = generateSessionToken();
  await sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${token}, ${userId}, ${buildExpiry()})`;
  await setSessionCookie(token);
}
