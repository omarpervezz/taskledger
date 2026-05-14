import { NextResponse } from "next/server";
import {
  deleteTodoService,
  searchTodosService,
} from "@/features/todos/services/todo.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const result = await searchTodosService(q);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result.data);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to search todos",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await deleteTodoService(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500 },
    );
  }
}
