import { getAuditLogsService } from "@/features/audit-logs/services/audit.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getAuditLogsService();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch audit logs",
      },
      { status: 500 },
    );
  }
}
