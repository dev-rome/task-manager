import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }
  const { email, password } = body;
  if (!email || typeof email !== "string" || email.trim() === "") {
    return NextResponse.json(
      { ok: false, error: "Email is required" },
      { status: 400 },
    );
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    return NextResponse.json(
      { ok: false, error: "Password is required" },
      { status: 400 },
    );
  }

  try {
    const [user] =
      await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await sql`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${token}, ${user.id}, ${expiresAt})
    `;
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true, // JS can't read it → safe from XSS theft
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      sameSite: "lax", // sent on normal navigation, mitigates CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 days, matches the session expiry
      path: "/", // sent on every route
    });
    return NextResponse.json(
      { ok: true, user: { id: user.id, email } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
