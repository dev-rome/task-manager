"use client";
import type { Task } from "@/lib/tasks";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-surface rounded-lg p-4 mb-3.5">
      <div className="text-sm font-medium mb-2">{task.title}</div>
      <span className="text-xs text-muted capitalize">{task.priority}</span>
    </div>
  );
}
