import type { SortingState } from "@tanstack/react-table"

export interface TableRequest {
  pageIndex: number
  pageSize: number
  search: string
  sorting: SortingState
  filters: Record<string, string>
}

export interface PagedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export function toSearchParams(request: TableRequest) {
  const params = new URLSearchParams({
    page: String(request.pageIndex + 1),
    pageSize: String(request.pageSize),
  })
  if (request.search) params.set("search", request.search)
  const sort = request.sorting[0]
  if (sort) {
    params.set("sortBy", sort.id)
    params.set("sortDirection", sort.desc ? "desc" : "asc")
  }
  Object.entries(request.filters).forEach(([key, value]) => {
    if (value) params.set(`filter_${key}`, value)
  })
  return params
}
