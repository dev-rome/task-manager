import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT now() AS Time`;
  return NextResponse.json({ ok: true, now: rows[0].time });
}
