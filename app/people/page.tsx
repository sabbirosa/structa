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
import type { Person } from "@/types/workforce"
import { Eye, Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

function PeoplePage() {
  const router = useRouter()
  const {
    data: people,
    total,
    loading,
    error,
    request,
    retry,
  } = usePagedApi<Person>("/api/people")
  const columns = useMemo<ColumnDef<DataGridFeatures, Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        id: "name",
        header: ({ column }) => (
          <SortableHeader column={column}>Person</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="flex min-w-48 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dff7f4] text-xs font-bold text-[#0b766f]">
              {row.original.firstName[0]}
              {row.original.lastName[0]}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                {row.original.firstName} {row.original.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
        size: 230,
      },
      {
        accessorKey: "jobTitle",
        header: ({ column }) => (
          <SortableHeader column={column}>Job title</SortableHeader>
        ),
        size: 180,
      },
      {
        accessorKey: "department",
        header: ({ column }) => (
          <SortableHeader column={column}>Department</SortableHeader>
        ),
        size: 135,
      },
      {
        accessorKey: "classification",
        header: ({ column }) => (
          <SortableHeader column={column}>Classification</SortableHeader>
        ),
        size: 150,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <SortableHeader column={column}>Location</SortableHeader>
        ),
        size: 120,
      },
      {
        accessorKey: "employmentStatus",
        header: ({ column }) => (
          <SortableHeader column={column}>Status</SortableHeader>
        ),
        cell: ({ row }) => (
          <StatusBadge value={row.original.employmentStatus} />
        ),
        size: 115,
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
              aria-label={`View ${row.original.firstName}`}
              render={<Link href={`/people/${row.original.id}`} />}
            >
              <Eye />
            </Button>
            <Can permission="person.edit">
              <Button
                nativeButton={false}
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${row.original.firstName}`}
                render={<Link href={`/people/${row.original.id}?edit=1`} />}
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
        eyebrow="Workforce directory"
        title="People"
        description="A complete view of your workforce, their placement, and current employment status."
        actions={
          <Can permission="person.edit">
            <Button
              nativeButton={false}
              render={<Link href="/people/new?edit=1" />}
            >
              <Plus className="size-4" />
              Add person
            </Button>
          </Can>
        }
      />
      <DataTable
        data={people}
        totalCount={total}
        onQueryChange={request}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        error={error}
        onRetry={retry}
        onRowClick={(row) => router.push(`/people/${row.id}`)}
        search={{
          placeholder: "Search by name or email…",
          accessors: [
            (row) => row.firstName,
            (row) => row.lastName,
            (row) => row.email,
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
            id: "employmentStatus",
            label: "Status",
            options: ["Active", "On leave", "Inactive"],
            accessor: (row) => row.employmentStatus,
          },
          {
            id: "classification",
            label: "Classification",
            options: [
              "Associate",
              "Professional",
              "Senior professional",
              "Manager",
              "Director",
            ],
            accessor: (row) => row.classification,
          },
        ]}
        defaultSorting={[{ id: "name", desc: false }]}
        toolbarActions={
          <ExportButton data={people} filename="structa-people" />
        }
      />
    </>
  )
}

export default withAuthorization(PeoplePage, { permission: "person.view" })
