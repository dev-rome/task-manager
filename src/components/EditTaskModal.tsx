"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/tasks";
import { Pencil } from "lucide-react";

export default function EditTaskModal({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, priority }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update task");
        return;
      }
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Edit task"
        className="text-muted hover:text-ink transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-4">Edit task</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-title" className="text-sm text-muted">
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-board rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-status" className="text-sm text-muted">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-board rounded px-3 py-2 text-sm"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-priority" className="text-sm text-muted">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-board rounded px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {error && <p className="text-error text-xs">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent w-fit px-3 py-1 rounded-sm text-white"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
