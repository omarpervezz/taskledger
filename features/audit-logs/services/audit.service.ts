import {
  findAuditLogs,
  insertAuditLog,
} from "../repositories/audit.repository";
import { toAuditLogDto } from "../mappers/audit.mapper";
import { ServiceResult } from "@/lib/types/service-result";
import { executeService } from "@/lib/utils/service-executor";
import { AuditLogDto } from "../types/audit.dto";

export function getAuditLogsService(): Promise<ServiceResult<AuditLogDto[]>> {
  return executeService(async () => {
    const logs = await findAuditLogs();
    return logs.map(toAuditLogDto);
  }, "Failed to fetch audit logs");
}

export async function logAuditActionService(input: {
  action: AuditLogDto["action"];
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  return executeService(async () => {
    await insertAuditLog(input);
    return null;
  }, "Failed to create audit log");
}
