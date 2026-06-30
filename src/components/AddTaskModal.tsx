"use client";
import { useState } from "react";

export default function AddTaskModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-accent rounded-full px-4 py-2 text-sm font-medium"
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
            <p className="text-muted text-sm">modal content here</p>
          </div>
        </div>
      )}
    </>
  );
}
