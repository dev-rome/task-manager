import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tasks";

export async function GET() {
  const { user, response } = await requireUser();
  if (response) return response;
  const tasks = await getTasksForUser(user.id);
  return NextResponse.json({ ok: true, tasks });
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (response) return response;
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
  const { title, description, priority } = body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { ok: false, error: "Title is required" },
      { status: 400 },
    );
  }

  // 3. Validate description
  if (description && typeof description !== "string") {
    return NextResponse.json(
      { ok: false, error: "Description must be text" },
      { status: 400 },
    );
  }

  // 4. Validate priority
  const ALLOWED_PRIORITIES = ["low", "medium", "high"];
  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    return NextResponse.json(
      { ok: false, error: "Invalid priority" },
      { status: 400 },
    );
  }
  const cleanTitle = title.trim();
  const cleanDescription = description?.trim() || null;
  // 5. Insert — past every guard, so any failure here is the server's fault → 500
  try {
    const [task] = await sql`
    INSERT INTO tasks (user_id, title, description, priority)
    VALUES (${user.id}, ${cleanTitle}, ${cleanDescription}, ${priority || "medium"})
    RETURNING *
  `;
    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to insert task:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
