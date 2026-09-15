"use client"

import { PageHeader } from "@/components/common/page-header"
import { StatusBadge } from "@/components/common/status-badge"
import {
  DataTable,
  type ColumnDef,
  type DataGridFeatures,
} from "@/components/data-table/data-table"
import { SortableHeader } from "@/components/data-table/sortable-header"
import { ExportButton } from "@/components/export/export-button"
import { Can } from "@/components/permissions/can"
import { withAuthorization } from "@/components/permissions/with-authorization"
import { Button } from "@/components/ui/button"
import { usePagedApi } from "@/hooks/use-paged-api"
import type { Employment } from "@/types/workforce"
import { Eye, Pencil } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

const date = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function EmploymentPage() {
  const router = useRouter()
  const {
    data: records,
    total,
    loading,
    error,
    request,
    retry,
  } = usePagedApi<Employment>("/api/employment")
  const columns = useMemo<ColumnDef<DataGridFeatures, Employment>[]>(
    () => [
      {
        accessorKey: "employee",
        header: ({ column }) => (
          <SortableHeader column={column}>Employee</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="min-w-42">
            <p className="font-semibold text-foreground">
              {row.original.employee}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.id}</p>
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: "position",
        header: ({ column }) => (
          <SortableHeader column={column}>Position</SortableHeader>
        ),
        size: 175,
      },
      {
        accessorKey: "department",
        header: ({ column }) => (
          <SortableHeader column={column}>Department</SortableHeader>
        ),
        size: 130,
      },
      {
        accessorKey: "employmentType",
        header: ({ column }) => (
          <SortableHeader column={column}>Type</SortableHeader>
        ),
        size: 115,
      },
      {
        accessorKey: "startDate",
        header: ({ column }) => (
          <SortableHeader column={column}>Start date</SortableHeader>
        ),
        cell: ({ row }) =>
          date.format(new Date(`${row.original.startDate}T00:00:00`)),
        size: 125,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader column={column}>Status</SortableHeader>
        ),
        cell: ({ row }) => <StatusBadge value={row.original.status} />,
        size: 115,
      },
      {
        accessorKey: "manager",
        header: ({ column }) => (
          <SortableHeader column={column}>Manager</SortableHeader>
        ),
        size: 150,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div
            className="flex justify-end gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              nativeButton={false}
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${row.original.employee}`}
              render={<Link href={`/employment/${row.original.id}`} />}
            >
              <Eye />
            </Button>
            <Can permission="employment.edit">
              <Button
                nativeButton={false}
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${row.original.employee}`}
                render={<Link href={`/employment/${row.original.id}?edit=1`} />}
              >
                <Pencil />
              </Button>
            </Can>
          </div>
        ),
        size: 88,
      },
    ],
    []
  )
  return (
    <>
      <PageHeader
        eyebrow="Workforce records"
        title="Employment"
        description="Review employment terms, reporting lines, and lifecycle dates across the organization."
      />
      <DataTable
        data={records}
        totalCount={total}
        onQueryChange={request}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        error={error}
        onRetry={retry}
        onRowClick={(row) => router.push(`/employment/${row.id}`)}
        search={{
          placeholder: "Search employee or position…",
          accessors: [
            (row) => row.employee,
            (row) => row.position,
            (row) => row.manager,
          ],
        }}
        filters={[
          {
            id: "department",
            label: "Department",
            options: [
              "Engineering",
              "Finance",
              "Legal",
              "Operations",
              "People",
              "Product",
              "Sales",
            ],
            accessor: (row) => row.department,
          },
          {
            id: "employmentType",
            label: "Type",
            options: ["Full-time", "Part-time", "Contract"],
            accessor: (row) => row.employmentType,
          },
          {
            id: "status",
            label: "Status",
            options: ["Active", "On leave", "Inactive"],
            accessor: (row) => row.status,
          },
        ]}
        defaultSorting={[{ id: "employee", desc: false }]}
        toolbarActions={
          <ExportButton data={records} filename="structa-employment" />
        }
      />
    </>
  )
}

export default withAuthorization(EmploymentPage, {
  permission: "employment.view",
})
