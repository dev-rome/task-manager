import { sql } from "./db";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function getTasksForUser(userId: string): Promise<Task[]> {
  const rows = await sql`
    SELECT * FROM tasks
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return rows as Task[];
}
