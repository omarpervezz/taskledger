/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut, useSession } from "next-auth/react";

export function CurrentUser() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {session.user.image ? (
        <img
          src={session.user.image}
          alt={session.user.name ?? "User"}
          className="h-9 w-9 rounded-full"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {session.user.name ?? "Signed in user"}
        </p>
        {session.user.email && (
          <p className="truncate text-xs text-slate-500">
            {session.user.email}
          </p>
        )}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        Sign out
      </button>
    </div>
  );
}
