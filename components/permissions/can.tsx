"use client"

import { can, type Permission } from "@/lib/permissions"
import { useRoleStore } from "@/stores/role-store"
import type { ReactNode } from "react"

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}) {
  const role = useRoleStore((state) => state.role)
  return can(role, permission) ? children : fallback
}
