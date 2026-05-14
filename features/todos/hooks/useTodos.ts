"use client";
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";

import { TodoDto } from "@/features/todos/types/todo.dto";
import { createTodoAction } from "@/app/actions/todo.actions";
import { emitMutationEvent } from "@/lib/events/mutation-event";

export type OptimisticTodo = TodoDto & { isPending?: boolean };

export function useTodos(initialTodos: TodoDto[]) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, addOptimisticTodo] = useOptimistic<
    OptimisticTodo[],
    OptimisticTodo
  >(initialTodos, (state, newTodo) => [newTodo, ...state]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TodoDto[]>([]);
  const requestIdRef = useRef(0);
  const [isSearching, setIsSearching] = useState(false);
  const isSearchingActive = debouncedQuery.trim().length > 0;
  const todosToRender = isSearchingActive ? searchResults : optimisticTodos;
  const isEmpty = todosToRender.length === 0;

  async function createTodo(formData: FormData) {
    setError(null);

    const title = formData.get("title");

    if (typeof title !== "string" || !title.trim()) {
      setError("Title is required");
      return { error: "Title is required" };
    }

    const tempId = crypto.randomUUID();

    startTransition(() => {
      addOptimisticTodo({
        id: tempId,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isPending: true,
      });
    });

    const result = await createTodoAction({ title });

    if (!result?.success) {
      setError(result?.error ?? "Something went wrong");
    }

    emitMutationEvent();

    return result;
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsSearching(true);

    async function fetchResults() {
      try {
        const res = await fetch(`/api/todos?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (currentRequestId === requestIdRef.current) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error(error || "Search failed");
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  return {
    todosToRender,
    createTodo,
    isPending,
    error,
    setQuery,
    query,
    isSearching,
    isSearchingActive,
    isEmpty,
  };
}
