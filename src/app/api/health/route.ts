import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT version()`;
  return NextResponse.json({ ok: true, version: rows[0].version });
}
