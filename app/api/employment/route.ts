import employmentData from "@/data/employment.json"
import { tableResponse } from "@/lib/api/server-table"
import type { Employment } from "@/types/workforce"
import { NextRequest } from "next/server"

const employment = employmentData as Employment[]

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 260))
  return tableResponse(request, employment, {
    search: (row) => [row.employee, row.position, row.manager],
    filters: {
      department: (row) => row.department,
      employmentType: (row) => row.employmentType,
      status: (row) => row.status,
    },
  })
}

export async function PUT(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return Response.json(await request.json())
}
