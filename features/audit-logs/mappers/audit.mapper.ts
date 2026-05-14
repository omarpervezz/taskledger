import { WithId } from "mongodb";
import { AuditLogModel } from "../types/audit.model";
import { AuditLogDto } from "../types/audit.dto";

export function toAuditLogDto(log: WithId<AuditLogModel>): AuditLogDto {
  return {
    _id: log._id.toString(),
    action: log.action as AuditLogDto["action"],
    entity: log.entity,
    entityId: log.entityId,
    metadata: log.metadata,
    createdAt: log.createdAt.toISOString(),
  };
}
