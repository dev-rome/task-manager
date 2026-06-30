import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tasks";
import LogoutButton from "@/components/LogoutButton";

const columns = [
  { key: "todo", label: "Todo", dot: "var(--color-todo)" },
  { key: "in_progress", label: "In progress", dot: "var(--color-progress)" },
  { key: "done", label: "Done", dot: "var(--color-done)" },
];

export default async function BoardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tasks = await getTasksForUser(user.id);

  return (
    <div className="min-h-screen bg-board text-white">
      <main className="p-4 sm:p-6">
        {/* header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-xl font-medium">My tasks</h1>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <button className="rounded-md border border-muted/30 px-3 py-2 text-sm text-muted">
              Theme
            </button>
            <button className="bg-accent rounded-full px-4 py-2 text-sm font-medium">
              + Add new task
            </button>
          </div>
        </header>
        {/* columns: stacked on mobile, side-by-side from md up */}
        <div className="flex flex-col md:flex-row gap-5">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <section key={col.key} className="w-full md:flex-1 md:min-w-0">
                <div className="flex items-center gap-2 mb-5 text-xs uppercase tracking-wider text-muted">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: col.dot }}
                  />
                  {col.label} ({colTasks.length})
                </div>
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface rounded-lg p-4 mb-3.5"
                  >
                    <div className="text-sm font-medium mb-2">{task.title}</div>
                    <span className="text-xs text-muted capitalize">
                      {task.priority}
                    </span>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-muted/30 p-6 text-center text-sm text-muted">
                    No tasks
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
