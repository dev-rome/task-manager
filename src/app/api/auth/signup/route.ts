import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
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
  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }
  try {
    // hashing at signup (await — it's deliberately slow, so it's async)
    const passwordHash = await bcrypt.hash(password, 12); // 12 = cost factor
    const userId = randomUUID();
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await sql.transaction([
      sql`INSERT INTO users (id, email, password_hash)
        VALUES (${userId}, ${email}, ${passwordHash})`,
      sql`INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${token}, ${userId}, ${expiresAt})`,
    ]);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true, // JS can't read it → safe from XSS theft
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      sameSite: "lax", // sent on normal navigation, mitigates CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 days, matches the session expiry
      path: "/", // sent on every route
    });
    return NextResponse.json(
      { ok: true, user: { id: userId, email } },
      { status: 201 },
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    console.error("Signup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
