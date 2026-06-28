import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return null;
  }
  const [session] =
    await sql`SELECT user_id, expires_at FROM sessions WHERE id = ${token}`;
  if (!session) {
    return null;
  }
  const expireDate = new Date(session.expires_at);
  const currentDate = new Date();
  if (expireDate < currentDate) {
    return null;
  }
  const [user] =
    await sql`SELECT id, email FROM users WHERE id = ${session.user_id}`;
  if (!user) {
    return null;
  }
  return user;
}
