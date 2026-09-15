"use client"

import type { DataGridFeatures } from "@/components/reui/data-grid/data-grid"
import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

export function SortableHeader<TData extends object>({
  column,
  children,
}: {
  column: Column<DataGridFeatures, TData, unknown>
  children: React.ReactNode
}) {
  const direction = column.getIsSorted()
  return (
    <button
      type="button"
      className="-ml-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:bg-accent hover:text-foreground"
      onClick={() => column.toggleSorting(direction === "asc")}
      aria-label={`Sort by ${String(children)}`}
    >
      {children}
      {direction === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : direction === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-60" />
      )}
    </button>
  )
}
