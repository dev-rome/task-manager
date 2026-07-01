"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create task");
        return;
      }
      setIsOpen(false);
      setTitle("");
      setPriority("medium");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-accent rounded-full px-4 py-2 text-sm font-medium text-white"
      >
        + Add new task
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
            <h2 className="text-lg font-medium mb-4">Add new task</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm text-muted">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Take coffee break"
                  className="bg-board rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="priority" className="text-sm text-muted">
                  Priority
                </label>
                <select
                  id="priority"
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
                className="bg-accent w-fit px-3 py-1 rounded-sm"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating task..." : "Create task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
