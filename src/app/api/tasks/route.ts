import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, tasks });
}

export async function POST(request: Request) {
  // 1. Parse the body — can throw if the JSON is malformed (client's fault → 400)
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  // 2. Validate the input at the boundary (client's fault → 400)
  const { title, description } = body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { ok: false, error: "Title is required" },
      { status: 400 },
    );
  }
  const TEMP_USER_ID = "ac362c98-3765-49bc-9929-f4ec8ad0e2d7";
  // 3. Insert — past every guard, so any failure here is the server's fault → 500
  try {
    const [task] = await sql`
    INSERT INTO tasks (user_id, title, description)
    VALUES (${TEMP_USER_ID}, ${title}, ${description})
    RETURNING *
  `;
    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to insert task:", error); // log the real error server-side
    return NextResponse.json(
      { ok: false, error: "Something went wrong" }, // generic message to the client
      { status: 500 },
    );
  }
}
