"use client"

import type { Role } from "@/lib/permissions"
import { create } from "zustand"

interface RoleState {
  user: {
    id: string
    name: string
    department: string
  } | null
  role: Role
  setUser: (user: RoleState["user"]) => void
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>((set) => ({
  user: {
    id: "P-0001",
    name: "Jordan Davis",
    department: "Operations",
  },
  role: "ADMIN",
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
}))
