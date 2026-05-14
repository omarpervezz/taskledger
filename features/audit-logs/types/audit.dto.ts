import { AuditEvent } from "../config/audit-event-registry";

export type AuditLogDto = {
  _id: string;
  action: AuditEvent;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
