import {
  insertTodo,
  findAllTodos,
  searchTodos,
  updateTodoStatusRepo,
  deleteTodoRepo,
} from "@/features/todos/repositories/todo.repository";
import { TodoSchema } from "@/features/todos/validations/todo.schema";
import { ServiceResult } from "@/lib/types/service-result";
import { TodoDto } from "@/features/todos/types/todo.dto";
import { z } from "zod";
import { toTodoDto } from "@/features/todos/mappers/todo.mapper";
import { executeService } from "@/lib/utils/service-executor";
import { audit } from "@/features/audit-logs/utils/audit";
import { AuditEvents } from "@/features/audit-logs/types/audit-events";

export function getTodosService(
  userId: string,
): Promise<ServiceResult<TodoDto[]>> {
  return executeService(async () => {
    const todos = await findAllTodos(userId);
    return todos.map(toTodoDto);
  }, "Failed to fetch todos");
}

export async function createTodoService(
  input: unknown,
  userId: string,
): Promise<ServiceResult<TodoDto>> {
  const parsed = TodoSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    return {
      success: false,
      error: tree.properties?.title?.errors?.[0] ?? "Invalid input",
    };
  }

  return executeService(async () => {
    const todo = await insertTodo(parsed.data.title, userId);
    await audit({
      action: AuditEvents.todo.created,
      entityId: todo._id.toString(),
      metadata: { title: todo.title },
    });
    return toTodoDto(todo);
  }, "Failed to create todo");
}

export function searchTodosService(
  query: string,
): Promise<ServiceResult<TodoDto[]>> {
  return executeService(async () => {
    const todos = await searchTodos(query);
    return todos.map(toTodoDto);
  }, "Failed to search todos");
}

export function updateTodoStatus(
  id: string,
  completed: boolean,
  version: number,
): Promise<ServiceResult<null>> {
  return executeService(async () => {
    const result = await updateTodoStatusRepo(id, completed, version);

    if (result.conflict) {
      throw new Error("conflict");
    }
    await audit({
      action: completed
        ? AuditEvents.todo.completed
        : AuditEvents.todo.uncompleted,
      entityId: id,
    });
    return null;
  }, "Failed to update todo status");
}

export function deleteTodoService(id: string): Promise<ServiceResult<null>> {
  return executeService(async () => {
    await deleteTodoRepo(id);
    await audit({
      action: AuditEvents.todo.deleted,
      entityId: id,
    });
    return null;
  }, "Failed to delete todo");
}
