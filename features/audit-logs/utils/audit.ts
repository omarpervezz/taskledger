import { logAuditActionService } from "../services/audit.service";
import { AuditEvent } from "../types/audit-events";

type AuditInput = {
  action: AuditEvent;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export async function audit(input: AuditInput) {
  await logAuditActionService({
    action: input.action,
    entity: input.action.split(".")[0],
    entityId: input.entityId,
    metadata: input.metadata,
  });
}
