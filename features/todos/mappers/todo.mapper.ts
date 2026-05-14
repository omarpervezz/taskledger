import { WithId } from "mongodb";
import { TodoModel } from "../types/todo.model";
import { TodoDto } from "../types/todo.dto";

export function toTodoDto(todo: WithId<TodoModel>): TodoDto {
  return {
    id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    version: todo.version,
    isPending: false,
  };
}
