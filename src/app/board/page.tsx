import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tasks";

export default async function BoardPage() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const tasks = await getTasksForUser(user.id);

  const columns = [
    { key: "todo", label: "Todo", dot: "#49c4e5" },
    { key: "in_progress", label: "In progress", dot: "#8471f2" },
    { key: "done", label: "Done", dot: "#67e2ae" },
  ];

  return (
    <div className="flex min-h-screen bg-[#20212c] text-white">
      {/* optional sidebar here later */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-medium">My tasks</h1>
          <button className="bg-[#635fc7] rounded-full px-4 py-2 text-sm font-medium">
            + Add new task
          </button>
        </header>

        <div className="flex gap-5">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <section key={col.key} className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-5 text-xs uppercase tracking-wider text-[#828fa3]">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: col.dot }}
                  />
                  {col.label} ({colTasks.length})
                </div>
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#2b2c37] rounded-lg p-4 mb-3.5"
                  >
                    <div className="text-sm font-medium mb-2">{task.title}</div>
                    <span className="text-xs text-[#828fa3] capitalize">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
