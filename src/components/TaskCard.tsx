"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/tasks";

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
    <div className="bg-surface rounded-lg p-4 mb-3.5">
      <div className="text-sm font-medium mb-2">{task.title}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted capitalize">{task.priority}</span>
        <div className="flex items-center gap-2">
          {task.status !== "done" && (
            <button
              className="text-xs text-muted hover:text-white"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              Done
            </button>
          )}
          <button
            className="text-xs text-muted hover:text-red-400"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
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
