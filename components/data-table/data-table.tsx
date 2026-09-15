"use client"

import { ErrorState } from "@/components/common/error-state"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/reui/data-grid/data-grid"
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TableRequest } from "@/lib/api/table-query"
import {
  useTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import { RotateCcw, Search } from "lucide-react"
import { useEffect, useMemo, useState, type ReactNode } from "react"

export interface DataTableFilter<TData> {
  id: string
  label: string
  options: readonly string[]
  accessor: (row: TData) => string
}

export interface DataTableSearch<TData> {
  placeholder?: string
  accessors: readonly ((row: TData) => unknown)[]
}

export interface DataTableProps<TData extends object> {
  data: TData[]
  columns: ColumnDef<DataGridFeatures, TData>[]
  getRowId: (row: TData) => string
  search: DataTableSearch<TData>
  filters?: DataTableFilter<TData>[]
  defaultSorting?: SortingState
  pageSize?: number
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  onRowClick?: (row: TData) => void
  toolbarActions?: ReactNode
  emptyMessage?: string
  totalCount?: number
  onQueryChange?: (request: TableRequest) => void
}

export function DataTable<TData extends object>({
  data,
  columns,
  getRowId,
  search,
  filters = [],
  defaultSorting = [],
  pageSize = 10,
  loading = false,
  error,
  onRetry,
  onRowClick,
  toolbarActions,
  emptyMessage = "No records match the current view.",
  totalCount,
  onQueryChange,
}: DataTableProps<TData>) {
  const [query, setQuery] = useState("")
  const [settledQuery, setSettledQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const clientFilteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return data.filter((row) => {
      const matchesSearch =
        !normalizedQuery ||
        search.accessors.some((accessor) =>
          String(accessor(row) ?? "")
            .toLocaleLowerCase()
            .includes(normalizedQuery)
        )
      const matchesFilters = filters.every(
        (filter) =>
          !filterValues[filter.id] ||
          filter.accessor(row) === filterValues[filter.id]
      )
      return matchesSearch && matchesFilters
    })
  }, [data, query, search.accessors, filters, filterValues])

  const serverMode = Boolean(onQueryChange)
  const displayedData = serverMode ? data : clientFilteredData
  const recordCount = serverMode ? (totalCount ?? 0) : clientFilteredData.length

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: displayedData,
    manualPagination: serverMode,
    manualSorting: serverMode,
    rowCount: recordCount,
    pageCount: serverMode
      ? undefined
      : Math.ceil(recordCount / pagination.pageSize),
    getRowId,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => setSettledQuery(query.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    onQueryChange?.({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: settledQuery,
      sorting,
      filters: filterValues,
    })
  }, [
    filterValues,
    onQueryChange,
    pagination.pageIndex,
    pagination.pageSize,
    settledQuery,
    sorting,
  ])

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length
  const reset = () => {
    setQuery("")
    setFilterValues({})
  }

  if (error) return <ErrorState message={error} onRetry={onRetry} />

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Search records"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPagination((current) => ({ ...current, pageIndex: 0 }))
            }}
            placeholder={search.placeholder ?? "Search records..."}
            className="h-10 bg-background pl-9 shadow-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={filterValues[filter.id] || "__all__"}
              onValueChange={(value) => {
                setFilterValues((current) => ({
                  ...current,
                  [filter.id]:
                    value === "__all__" || value == null ? "" : value,
                }))
                setPagination((current) => ({ ...current, pageIndex: 0 }))
              }}
            >
              <SelectTrigger
                aria-label={filter.label}
                className="h-10 min-w-36 bg-background"
              >
                <SelectValue>
                  {filterValues[filter.id] ||
                    `All ${filter.label.toLocaleLowerCase()}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="__all__">
                  All {filter.label.toLocaleLowerCase()}
                </SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {(query || activeFilterCount > 0) && (
            <Button
              variant="ghost"
              onClick={reset}
              className="text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-muted px-1.5 text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
          {toolbarActions}
        </div>
      </div>
      <DataGrid
        table={table}
        recordCount={recordCount}
        isLoading={loading}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        tableLayout={{
          headerBackground: true,
          rowBorder: true,
          columnsResizable: true,
        }}
      >
        <DataGridContainer className="border-0">
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <div className="border-t border-border px-4 py-2">
          <DataGridPagination sizes={[5, 10, 25, 50]} />
        </div>
      </DataGrid>
    </section>
  )
}

export type { ColumnDef, DataGridFeatures }
