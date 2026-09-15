"use client"

import { can, type Permission } from "@/lib/permissions"
import { useRoleStore } from "@/stores/role-store"
import { LockKeyhole, ShieldAlert } from "lucide-react"
import type { ComponentType } from "react"

interface AuthorizationOptions<Props> {
  permission: Permission | ((props: Props) => Permission)
}

/**
 * Common route-level authentication and RBAC boundary.
 *
 * Keep this guard on every protected screen. Use <Can> inside a screen for
 * finer-grained action and field visibility.
 */
export function withAuthorization<Props extends object>(
  Component: ComponentType<Props>,
  { permission }: AuthorizationOptions<Props>
) {
  function AuthorizedComponent(props: Props) {
    const user = useRoleStore((state) => state.user)
    const role = useRoleStore((state) => state.role)
    const requiredPermission =
      typeof permission === "function" ? permission(props) : permission

    if (!user) {
      return (
        <AuthorizationMessage
          icon={LockKeyhole}
          eyebrow="Authentication required"
          title="Sign in to continue"
          description="Your session is no longer available. Sign in again to access Structa."
        />
      )
    }

    if (!can(role, requiredPermission)) {
      return (
        <AuthorizationMessage
          icon={ShieldAlert}
          eyebrow="Restricted access"
          title="You don’t have permission to view this page"
          description="Switch to an authorized role or contact an administrator for access."
        />
      )
    }

    return <Component {...props} />
  }

  AuthorizedComponent.displayName = `withAuthorization(${Component.displayName ?? Component.name ?? "Component"})`
  return AuthorizedComponent
}

function AuthorizationMessage({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof LockKeyhole
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="mx-auto mt-16 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <span className="mx-auto grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  )
}
