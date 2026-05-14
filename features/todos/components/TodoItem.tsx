"use client";
import { Loader2, Trash2 } from "lucide-react";
import { ConfirmModal, TodoDto } from "@/features/todos";
import { useState, useTransition } from "react";
import { toggleTodoAction } from "@/app/actions/todo.actions";
import { emitMutationEvent } from "@/lib/events/mutation-event";
import { useRouter } from "next/navigation";

export default function TodoItem({ todo }: { todo: TodoDto }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function handleToggle() {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleTodoAction(
        todo.id,
        !todo.completed,
        todo.version,
      );

      if (result?.conflict) {
        alert(
          "This todo has been modified by another process. Please refresh the page to see the latest data.",
        );
      }
      emitMutationEvent();
    });
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.error("Delete failed:", data);
    }

    setIsDeleting(false);
    setIsModalOpen(false);
    router.refresh();
    emitMutationEvent();
  }

  return (
    <>
      <li
        className={`
    flex items-center justify-between
    rounded-lg border border-slate-200
    px-4 py-2
    transition-all duration-300
    hover:bg-slate-50`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <input
            checked={todo.completed}
            onChange={handleToggle}
            type="checkbox"
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />

          <span
            className={`text-sm font-medium transition-all ${
              todo.completed ? "line-through text-slate-400" : "text-slate-800"
            }`}
          >
            {todo.title}
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {todo.completed && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
              Completed
            </span>
          )}
          {!todo.isPending && (
            <button
              onClick={() => !isDeleting && setIsModalOpen(true)}
              disabled={isDeleting}
              className={`flex items-center gap-1.5 text-red-500 border px-2 py-1 rounded-md text-sm transition min-w-22.5 justify-center
    ${isDeleting ? "bg-red-50 cursor-not-allowed" : "hover:bg-red-50 cursor-pointer"}
  `}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          )}

          {todo.isPending && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
              Pending...
            </span>
          )}
        </div>
      </li>

      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
