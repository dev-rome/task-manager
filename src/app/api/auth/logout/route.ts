import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
      await sql`DELETE FROM sessions WHERE id = ${token}`;
    }
    cookieStore.delete("session");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
