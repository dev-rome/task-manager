import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Authentication required" },
      { status: 401 },
    );
  }
  const tasks =
    await sql`SELECT * FROM tasks WHERE user_id = ${user.id} ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, tasks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Authentication required" },
      { status: 401 },
    );
  }
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
  // 3. Insert — past every guard, so any failure here is the server's fault → 500
  try {
    const [task] = await sql`
    INSERT INTO tasks (user_id, title, description)
    VALUES (${user.id}, ${title}, ${description})
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
