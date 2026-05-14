"use server";

import {
  createTodoService,
  deleteTodoService,
  updateTodoStatus,
} from "@/features/todos/services/todo.service";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTodoAction(input: { title: string }) {
  const userId = await requireUserId();
  const result = await createTodoService(input, userId);

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/");

  return { success: true };
}

export async function toggleTodoAction(
  id: string,
  completed: boolean,
  version: number,
) {
  const result = await updateTodoStatus(id, completed, version);

  if (!result.success && result.error === "conflict") {
    return { conflict: true };
  }

  revalidatePath("/");

  return { success: true };
}

export async function deleteTodoAction(id: string) {
  const result = await deleteTodoService(id);

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/");

  return { success: true };
}
