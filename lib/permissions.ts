export type Role = "ADMIN" | "MANAGER" | "VIEWER"

export type Permission =
  | "person.view"
  | "person.edit"
  | "employment.view"
  | "employment.edit"
  | "classification.view"
  | "classification.create"
  | "classification.edit"

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  ADMIN: new Set([
    "person.view",
    "person.edit",
    "employment.view",
    "employment.edit",
    "classification.view",
    "classification.create",
    "classification.edit",
  ]),
  MANAGER: new Set([
    "person.view",
    "employment.view",
    "employment.edit",
    "classification.view",
  ]),
  VIEWER: new Set(["person.view", "employment.view", "classification.view"]),
}

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].has(permission)
}
