"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/tasks";
import EditTaskModal from "@/components/EditTaskModal";

const priorityStyles: Record<string, string> = {
  low: "bg-todo/15 text-todo",
  medium: "bg-progress/15 text-progress",
  high: "bg-error/15 text-error",
};

export default function TaskCard({ task }: { task: Task }) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();

  async function handleComplete() {
    setCompleteError("");
    setIsCompleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setCompleteError(data.error || "Failed to update task");
        return;
      }
      router.refresh();
    } catch {
      setCompleteError("Something went wrong.");
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setDeleteError("");
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete task");
        return;
      }
      router.refresh();
    } catch {
      setDeleteError("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="bg-surface rounded-lg p-4 mb-3.5 hover:shadow-lg transition-shadow group">
      <div className="text-sm font-medium mb-3">{task.title}</div>
      <div className="mb-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full capitalize ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-muted/15">
        {task.status !== "done" ? (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            aria-label="Mark complete"
            className="w-5 h-5 rounded-full border-2 border-muted hover:border-accent transition-colors shrink-0"
          />
        ) : (
          <span
            aria-label="Completed"
            className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        <div className="flex items-center gap-3">
          <EditTaskModal task={task} />
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete task"
            className="text-muted hover:text-red-400 transition-colors shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H7a1 1 0 01-1-1V6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {(completeError || deleteError) && (
        <p className="text-error text-xs mt-2">
          {completeError || deleteError}
        </p>
      )}
    </div>
  );
}
