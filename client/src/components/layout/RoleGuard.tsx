"use client";

import { ReactNode } from "react";
import type { Role } from "@/types/common";
import { getStoredUser, hasRole } from "@/lib/auth";

interface RoleGuardProps {
  children: ReactNode;
  roles: Role[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const user = getStoredUser();

  if (!user || !hasRole(user, ...roles)) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">Access Denied</p>
          <p className="text-gray-400 text-sm">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
