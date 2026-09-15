"use client"

import { useCallback, useEffect, useState } from "react"

export function useApiData<T>(request: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await request())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request failed.")
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    // Initial synchronization with the resource selected by the route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])
  return { data, setData, loading, error, retry: load }
}
