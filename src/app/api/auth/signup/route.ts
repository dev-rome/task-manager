import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  buildExpiry,
  setSessionCookie,
  generateSessionToken,
} from "@/lib/auth";
import { randomUUID } from "crypto";
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
    const token = generateSessionToken();
    await sql.transaction([
      sql`INSERT INTO users (id, email, password_hash) VALUES (${userId}, ${email}, ${passwordHash})`,
      sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${token}, ${userId}, ${buildExpiry()})`,
    ]);
    await setSessionCookie(token);
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
