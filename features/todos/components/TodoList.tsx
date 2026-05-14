"use client";
import {
  TodoItem,
  CreateTodoForm,
  SearchBar,
  EmptyState,
} from "@/features/todos";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { TodoDto } from "@/features/todos";

type Props = {
  initialTodos: TodoDto[];
};

export default function TodoList({ initialTodos }: Props) {
  const {
    todosToRender,
    createTodo,
    error,
    setQuery,
    query,
    isSearching,
    isSearchingActive,
    isEmpty,
  } = useTodos(initialTodos);

  return (
    <div className="px-3 py-2 space-y-3 flex-1 bg-white">
      <SearchBar value={query} onChange={setQuery} isSearching={isSearching} />
      <CreateTodoForm onSubmit={createTodo} error={error} />
      <div className="mt-4">
        {isEmpty ? (
          <EmptyState isSearching={isSearchingActive} />
        ) : (
          <ul className="space-y-3">
            {todosToRender.map((todo: TodoDto) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
