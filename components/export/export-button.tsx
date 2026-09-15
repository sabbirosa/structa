"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

function csvCell(value: unknown) {
  const text = String(value ?? "")
  return `"${text.replaceAll('"', '""')}"`
}

export function ExportButton<T extends object>({
  data,
  filename,
}: {
  data: T[]
  filename: string
}) {
  const exportCsv = () => {
    if (!data.length) return
    const keys = Object.keys(data[0]) as (keyof T)[]
    const csv = [
      keys.map(csvCell).join(","),
      ...data.map((row) => keys.map((key) => csvCell(row[key])).join(",")),
    ].join("\n")
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${filename}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={exportCsv}
      disabled={!data.length}
    >
      <Download className="size-4" />
      Export
    </Button>
  )
}
