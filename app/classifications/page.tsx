"use client"

import { ClassificationPanel } from "@/components/classifications/classification-panel"
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
import type { Classification } from "@/types/workforce"
import { Eye, Pencil, Plus } from "lucide-react"
import { useMemo, useState } from "react"

const blank: Classification = {
  id: "C-NEW",
  name: "",
  code: "",
  description: "",
  status: "Active",
  assignedPeople: 0,
  lastUpdated: new Date().toISOString().slice(0, 10),
}

function ClassificationsPage() {
  const {
    data: records,
    setData,
    total,
    loading,
    error,
    request,
    retry,
  } = usePagedApi<Classification>("/api/classifications")
  const [selection, setSelection] = useState<{
    classification: Classification
    editing: boolean
  } | null>(null)
  const columns = useMemo<ColumnDef<DataGridFeatures, Classification>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader column={column}>Classification</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="min-w-40">
            <p className="font-semibold text-foreground">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        ),
        size: 190,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <p className="max-w-md truncate text-muted-foreground">
            {row.original.description}
          </p>
        ),
        enableSorting: false,
        size: 320,
        meta: { fillWidth: true },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader column={column}>Status</SortableHeader>
        ),
        cell: ({ row }) => <StatusBadge value={row.original.status} />,
        size: 110,
      },
      {
        accessorKey: "assignedPeople",
        header: ({ column }) => (
          <SortableHeader column={column}>People</SortableHeader>
        ),
        size: 95,
      },
      {
        accessorKey: "lastUpdated",
        header: ({ column }) => (
          <SortableHeader column={column}>Updated</SortableHeader>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${row.original.name}`}
              onClick={() =>
                setSelection({ classification: row.original, editing: false })
              }
            >
              <Eye />
            </Button>
            <Can permission="classification.edit">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${row.original.name}`}
                onClick={() =>
                  setSelection({ classification: row.original, editing: true })
                }
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
  const save = (classification: Classification) => {
    setData((current) => {
      const list = current ?? []
      return list.some((item) => item.id === classification.id)
        ? list.map((item) =>
            item.id === classification.id ? classification : item
          )
        : [
            ...list,
            {
              ...classification,
              id: `C-${String(list.length + 1).padStart(2, "0")}`,
            },
          ]
    })
    setSelection(null)
  }
  return (
    <>
      <PageHeader
        eyebrow="Workforce framework"
        title="Classifications"
        description="Maintain the standardized levels used to organize roles, responsibilities, and reporting."
        actions={
          <Can permission="classification.create">
            <Button
              onClick={() =>
                setSelection({ classification: blank, editing: true })
              }
            >
              <Plus className="size-4" />
              New classification
            </Button>
          </Can>
        }
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
        onRowClick={(row) =>
          setSelection({ classification: row, editing: false })
        }
        search={{
          placeholder: "Search name, code, or description…",
          accessors: [
            (row) => row.name,
            (row) => row.code,
            (row) => row.description,
          ],
        }}
        filters={[
          {
            id: "status",
            label: "Status",
            options: ["Active", "Archived"],
            accessor: (row) => row.status,
          },
        ]}
        defaultSorting={[{ id: "name", desc: false }]}
        pageSize={5}
        toolbarActions={
          <ExportButton data={records} filename="structa-classifications" />
        }
      />
      {selection && (
        <ClassificationPanel
          {...selection}
          onClose={() => setSelection(null)}
          onSaved={save}
        />
      )}
    </>
  )
}

export default withAuthorization(ClassificationsPage, {
  permission: "classification.view",
})
