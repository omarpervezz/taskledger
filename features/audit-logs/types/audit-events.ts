export const AuditEvents = {
  todo: {
    created: "todo.created",
    deleted: "todo.deleted",
    completed: "todo.completed",
    uncompleted: "todo.uncompleted",
  },
} as const;

export type AuditEvent =
  (typeof AuditEvents)[keyof typeof AuditEvents][keyof (typeof AuditEvents)["todo"]];
