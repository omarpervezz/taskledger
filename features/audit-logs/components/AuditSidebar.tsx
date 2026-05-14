"use client";

import { useEffect, useState } from "react";
import { subscribeToMutations } from "@/lib/events/mutation-event";
import { AuditLogDto } from "../types/audit.dto";
import { formatLog } from "../utils/format-log";
import { AuditEventRegistry } from "../config/audit-event-registry";
import { formatDistanceToNow } from "date-fns";

export default function AuditSidebar() {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);

  async function fetchLogs() {
    const res = await fetch("/api/audit");
    const data = await res.json();
    console.log(data);
    setLogs(data);
  }

  useEffect(() => {
    (async () => {
      await fetchLogs();
    })();

    const unsubscribe = subscribeToMutations(() => {
      fetchLogs();
    });

    return unsubscribe;
  }, []);

  return (
    <aside className="border-l border-slate-200 bg-white px-5 py-5 overflow-y-auto">
      <h2 className="text-lg font-semibold text-slate-800">
        Activity Audit Logs
      </h2>

      <div className="relative mt-6">
        {/* vertical timeline line */}
        <div className="absolute left-4 top-0 h-full w-px bg-slate-200" />

        <ul className="space-y-6">
          {logs.map((log) => {
            const event = AuditEventRegistry[log.action];
            const Icon = event?.icon;

            return (
              <li key={log._id} className="relative pl-10 ">
                {/* icon circle */}
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm">
                  {Icon && <Icon className={`h-4 w-4 ${event.color}`} />}
                </div>

                {/* timestamp */}
                <p
                  className="mb-1 text-xs text-slate-400"
                  title={new Date(log.createdAt).toLocaleString()}
                >
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </p>

                {/* message */}
                <p className="text-sm leading-snug text-slate-700">
                  {formatLog(log)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
