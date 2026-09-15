"use client"

import {
  toSearchParams,
  type PagedResponse,
  type TableRequest,
} from "@/lib/api/table-query"
import { useCallback, useRef, useState } from "react"

export function usePagedApi<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastRequest = useRef<TableRequest | null>(null)
  const abort = useRef<AbortController | null>(null)

  const request = useCallback(
    async (tableRequest: TableRequest) => {
      lastRequest.current = tableRequest
      abort.current?.abort()
      const controller = new AbortController()
      abort.current = controller
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${endpoint}?${toSearchParams(tableRequest)}`,
          { signal: controller.signal }
        )
        if (!response.ok)
          throw new Error(`Request failed with status ${response.status}.`)
        const page = (await response.json()) as PagedResponse<T>
        setData(page.data)
        setTotal(page.total)
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return
        setError(cause instanceof Error ? cause.message : "The request failed.")
      } finally {
        if (abort.current === controller) setLoading(false)
      }
    },
    [endpoint]
  )

  const retry = useCallback(() => {
    if (lastRequest.current) void request(lastRequest.current)
  }, [request])
  return { data, setData, total, loading, error, request, retry }
}
