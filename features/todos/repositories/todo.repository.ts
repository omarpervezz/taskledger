import clientPromise from "@/lib/mongodb";
import { TodoModel } from "../types/todo.model";
import { ObjectId, WithId } from "mongodb";

const COLLECTION = "production-todos";

export async function findAllTodos(
  userId: string,
): Promise<WithId<TodoModel>[]> {
  const client = await clientPromise;
  const db = client.db();

  return db
    .collection<TodoModel>(COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function insertTodo(
  title: string,
  userId: string,
): Promise<WithId<TodoModel>> {
  const client = await clientPromise;
  const db = client.db();

  const newTodo: TodoModel = {
    userId,
    title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };

  const result = await db.collection<TodoModel>(COLLECTION).insertOne(newTodo);

  return {
    _id: result.insertedId,
    ...newTodo,
  };
}

export async function searchTodos(query: string): Promise<WithId<TodoModel>[]> {
  const client = await clientPromise;
  const db = client.db();

  const trimmed = query.trim();
  if (!trimmed) return [];

  return db
    .collection<TodoModel>(COLLECTION)
    .find({
      title: { $regex: trimmed, $options: "i" },
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateTodoStatusRepo(
  id: string,
  completed: boolean,
  version: number,
): Promise<{ conflict?: true }> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<TodoModel>(COLLECTION).updateOne(
    {
      _id: new ObjectId(id),
      version,
    },
    {
      $set: {
        completed,
        updatedAt: new Date(),
      },
      $inc: {
        version: 1,
      },
    },
  );

  if (result.matchedCount === 0) {
    return { conflict: true };
  }

  return {};
}

export async function deleteTodoRepo(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection<TodoModel>(COLLECTION).deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    throw new Error("Todo not found");
  }

  return true;
}
