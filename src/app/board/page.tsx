import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tasks";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import AddTaskModal from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";

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
    <div className="min-h-screen bg-board text-ink">
      <main className="p-4 sm:p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-xl font-medium">My tasks</h1>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <ThemeToggle />
            <AddTaskModal />
          </div>
        </header>
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
                  <TaskCard key={task.id} task={task} />
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
