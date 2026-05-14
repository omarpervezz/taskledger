import { AuditSidebar } from "@/features/audit-logs";
import { CurrentUser } from "@/features/auth/components/CurrentUser";
import { TodoList } from "@/features/todos";
import { getTodosService } from "@/features/todos/services/todo.service";
import { requireUserId } from "@/lib/auth";

export default async function Page() {
  const userId = await requireUserId();
  const result = await getTodosService(userId);

  if (!result.success) {
    return <div>Failed to load todos</div>;
  }

  return (
    <main className="flex h-screen overflow-hidden bg-slate-50">
      {/* LEFT SIDEBAR */}
      <aside className="hidden w-75 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-4">
          <CurrentUser />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 overflow-y-auto p-4">
        <TodoList initialTodos={result.data} />
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden w-105 border-l border-slate-200 bg-white lg:block overflow-y-auto">
        <AuditSidebar />
      </aside>
    </main>
  );
}
