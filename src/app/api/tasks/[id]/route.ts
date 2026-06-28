import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isValidUuid } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireUser();
  if (response) return response;
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid task id" },
      { status: 400 },
    );
  }
  try {
    const [task] =
      await sql`SELECT * FROM tasks WHERE id = ${id} AND user_id = ${user.id}`;
    if (!task) {
      return NextResponse.json(
        { ok: false, error: "Task not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, task }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireUser();
  if (response) return response;
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid task id" },
      { status: 400 },
    );
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }
  const ALLOWED = ["title", "description", "status", "priority"];
  // keep only allowlisted fields the client actually sent
  const fields = Object.keys(body).filter((key) => ALLOWED.includes(key));
  if (fields.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No valid fields to update" },
      { status: 400 },
    );
  }
  try {
    // each fragment: `status = $n` — column raw (trusted), value parameterized (safe)
    const updates = fields.map(
      (field) => sql`${sql.unsafe(field)} = ${body[field]}`,
    );
    // compose fragments into one, comma-separated — composition renumbers placeholders
    let setClause = updates[0];
    for (let i = 1; i < updates.length; i++) {
      setClause = sql`${setClause}, ${updates[i]}`;
    }
    const [task] = await sql`
      UPDATE tasks
      SET ${setClause}, updated_at = now()
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;
    if (!task) {
      return NextResponse.json(
        { ok: false, error: "Task not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, task }, { status: 200 });
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireUser();
  if (response) return response;
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid task id" },
      { status: 400 },
    );
  }
  try {
    const [task] =
      await sql`DELETE FROM tasks WHERE id = ${id} AND user_id = ${user.id} RETURNING *`;
    if (!task) {
      return NextResponse.json(
        { ok: false, error: "Task not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete task", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
