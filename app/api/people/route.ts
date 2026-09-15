import peopleData from "@/data/people.json"
import { tableResponse } from "@/lib/api/server-table"
import type { Person } from "@/types/workforce"
import { NextRequest } from "next/server"

const people = peopleData as Person[]

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 260))
  return tableResponse(request, people, {
    search: (row) => [row.firstName, row.lastName, row.email],
    sortValues: { name: (row) => `${row.firstName} ${row.lastName}` },
    filters: {
      department: (row) => row.department,
      employmentStatus: (row) => row.employmentStatus,
      classification: (row) => row.classification,
    },
  })
}

export async function PUT(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return Response.json(await request.json())
}
