"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Role } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { useRoleStore } from "@/stores/role-store"
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronsUpDown,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigation = [
  { href: "/people", label: "People", icon: Users },
  { href: "/employment", label: "Employment", icon: BriefcaseBusiness },
  { href: "/classifications", label: "Classifications", icon: Building2 },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = useRoleStore((state) => state.role)
  const setRole = useRoleStore((state) => state.setRole)
  const user = useRoleStore((state) => state.user)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-17 items-center justify-between border-b border-sidebar-border px-5">
          <Link
            href="/people"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#5dd6a8] text-sm font-black text-[#122019]">
              S
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight">
                Structa
              </span>
              <span className="block text-[10px] font-medium tracking-[.18em] text-slate-400 uppercase">
                Workforce OS
              </span>
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
          <p className="px-3 pt-4 pb-2 text-[10px] font-semibold tracking-[.18em] text-muted-foreground uppercase">
            Workspace
          </p>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("size-4", active && "text-primary")} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Permission preview
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Switch roles from your account menu to test action visibility and
            restricted fields.
          </p>
        </div>
        <div className="border-t border-sidebar-border p-3">
          <AccountSwitcher role={role} setRole={setRole} user={user} />
        </div>
      </aside>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-17 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground sm:flex">
            <span>Dashboard</span>
            <span>/</span>
            <span>Workforce</span>
            <span>/</span>
            <span className="font-medium text-foreground">
              {navigation.find((item) => pathname.startsWith(item.href))
                ?.label ?? "Overview"}
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      title="Toggle theme (D)"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      disabled={!mounted}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}

const roleMeta: Record<Role, { label: string; access: string }> = {
  ADMIN: { label: "Admin", access: "Full access" },
  MANAGER: { label: "Manager", access: "Team access" },
  VIEWER: { label: "Viewer", access: "Read only" },
}

function AccountSwitcher({
  role,
  setRole,
  user,
}: {
  role: Role
  setRole: (role: Role) => void
  user: { name: string; department: string } | null
}) {
  const name = user?.name ?? "Signed out"
  const initials = user
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
    : "?"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition outline-none hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {roleMeta[role].label} · {roleMeta[role].access}
          </p>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-58"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block text-sm font-semibold text-foreground">
              Switch account role
            </span>
            <span className="mt-0.5 block font-normal">
              Preview permissions as {name}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {(Object.keys(roleMeta) as Role[]).map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => setRole(item)}
            className="min-h-11 gap-3 px-2"
          >
            <span className="grid size-7 place-items-center rounded-md bg-muted text-[10px] font-bold">
              {roleMeta[item].label.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{roleMeta[item].label}</span>
              <span className="block text-xs text-muted-foreground">
                {roleMeta[item].access}
              </span>
            </span>
            {role === item && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
