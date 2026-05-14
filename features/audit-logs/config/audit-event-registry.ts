import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

export const AuditEventRegistry = {
  "todo.created": {
    icon: Plus,
    color: "text-green-600",
    format: (metadata?: Record<string, unknown>) =>
      `Todo "${metadata?.title}" created`,
  },

  "todo.deleted": {
    icon: Trash2,
    color: "text-red-500",
    format: () => "Todo deleted",
  },

  "todo.completed": {
    icon: CheckCircle,
    color: "text-blue-500",
    format: (metadata?: Record<string, unknown>) =>
      `Todo "${metadata?.title}" completed`,
  },
  "todo.uncompleted": {
    icon: Circle,
    color: "text-slate-500",
    format: () => "Todo marked incomplete",
  },
} as const;

export type AuditEvent = keyof typeof AuditEventRegistry;
