import clientPromise from "@/lib/mongodb";
import { AuditLogModel } from "../types/audit.model";
import { WithId } from "mongodb";

const COLLECTION = "audit_logs";

export async function insertAuditLog(input: {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const client = await clientPromise;
  const db = client.db();

  const log: AuditLogModel = {
    ...input,
    createdAt: new Date(),
  };

  await db.collection<AuditLogModel>("audit_logs").insertOne(log);
}

export async function findAuditLogs(): Promise<WithId<AuditLogModel>[]> {
  const client = await clientPromise;
  const db = client.db();

  return db
    .collection<AuditLogModel>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
}
