import { NextRequest, NextResponse } from "next/server"

type Primitive = string | number | null

export function tableResponse<T extends object>(
  request: NextRequest,
  source: T[],
  options: {
    search: (row: T) => Primitive[]
    sortValues?: Record<string, (row: T) => Primitive>
    filters?: Record<string, (row: T) => Primitive>
  }
) {
  const params = request.nextUrl.searchParams
  const id = params.get("id")
  if (id)
    return NextResponse.json(
      source.find(
        (row) => String((row as Record<string, unknown>).id) === id
      ) ?? null
    )
  const page = Math.max(1, Number(params.get("page")) || 1)
  const pageSize = Math.min(
    100,
    Math.max(1, Number(params.get("pageSize")) || 10)
  )
  const search = (params.get("search") ?? "").trim().toLocaleLowerCase()
  let rows = source.filter(
    (row) =>
      !search ||
      options.search(row).some((value) =>
        String(value ?? "")
          .toLocaleLowerCase()
          .includes(search)
      )
  )
  Object.entries(options.filters ?? {}).forEach(([key, accessor]) => {
    const value = params.get(`filter_${key}`)
    if (value)
      rows = rows.filter((row) => String(accessor(row) ?? "") === value)
  })
  const sortBy = params.get("sortBy")
  const accessor = sortBy
    ? (options.sortValues?.[sortBy] ??
      ((row: T) => (row as Record<string, Primitive>)[sortBy]))
    : null
  if (accessor) {
    const direction = params.get("sortDirection") === "desc" ? -1 : 1
    rows = [...rows].sort(
      (left, right) =>
        String(accessor(left) ?? "").localeCompare(
          String(accessor(right) ?? ""),
          undefined,
          { numeric: true }
        ) * direction
    )
  }
  const total = rows.length
  const start = (page - 1) * pageSize
  return NextResponse.json({
    data: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  })
}
