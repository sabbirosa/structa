import classificationsData from "@/data/classifications.json"
import { tableResponse } from "@/lib/api/server-table"
import type { Classification } from "@/types/workforce"
import { NextRequest } from "next/server"

const classifications = classificationsData as Classification[]

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 260))
  return tableResponse(request, classifications, {
    search: (row) => [row.name, row.code, row.description],
    filters: { status: (row) => row.status },
  })
}

export async function PUT(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return Response.json(await request.json())
}
