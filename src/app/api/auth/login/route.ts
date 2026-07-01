import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { normalizeEmail } from "@/lib/validation";
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
  const cleanEmail = normalizeEmail(email);
  try {
    const [user] =
      await sql`SELECT id, password_hash FROM users WHERE email = ${cleanEmail}`;
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
    await createSession(user.id);
    return NextResponse.json(
      { ok: true, user: { id: user.id, email: cleanEmail } },
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
