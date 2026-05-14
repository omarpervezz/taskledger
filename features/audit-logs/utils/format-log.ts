import { AuditEventRegistry } from "../config/audit-event-registry";
import { AuditLogDto } from "../types/audit.dto";

export function formatLog(log: AuditLogDto) {
  const event = AuditEventRegistry[log.action];

  if (!event) return log.action;

  return event.format(log.metadata);
}
