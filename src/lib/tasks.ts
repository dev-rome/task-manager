import { sql } from "./db";

export async function getTasksForUser(userId: string) {
  return sql`
    SELECT * FROM tasks
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    `;
}
