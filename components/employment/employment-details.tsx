"use client"

import { ErrorState } from "@/components/common/error-state"
import { StatusBadge } from "@/components/common/status-badge"
import { EmploymentForm } from "@/components/employment/employment-form"
import { Can } from "@/components/permissions/can"
import { withAuthorization } from "@/components/permissions/with-authorization"
import { Button } from "@/components/ui/button"
import { useApiData } from "@/hooks/use-api-data"
import { employmentApi } from "@/lib/api/employment"
import { can } from "@/lib/permissions"
import { useRoleStore } from "@/stores/role-store"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

function EmploymentDetailsView({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const role = useRoleStore((state) => state.role)
  const mayEdit = can(role, "employment.edit")
  const request = useCallback(() => employmentApi.get(id), [id])
  const { data, setData, loading, error, retry } = useApiData(request)
  const [editing, setEditing] = useState(
    mayEdit && searchParams.get("edit") === "1"
  )
  const isEditing = editing && mayEdit
  if (loading)
    return (
      <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
    )
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data)
    return <ErrorState message="This employment record could not be found." />
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/employment"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to employment
      </Link>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            {data.id}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {data.employee}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.position} · {data.department}
          </p>
        </div>
        {!isEditing && (
          <Can permission="employment.edit">
            <Button onClick={() => setEditing(true)}>
              <Pencil className="size-4" />
              Edit record
            </Button>
          </Can>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
        {isEditing ? (
          <EmploymentForm
            record={data}
            onSaved={(saved) => {
              setData(saved)
              setEditing(false)
            }}
          />
        ) : (
          <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {[
              ["Employee", data.employee],
              ["Position", data.position],
              ["Department", data.department],
              ["Employment type", data.employmentType],
              ["Start date", data.startDate],
              ["End date", data.endDate ?? "Ongoing"],
              ["Manager", data.manager],
              ["Status", <StatusBadge key="status" value={data.status} />],
            ].map(([label, value]) => (
              <div key={String(label)} className="border-b border-border pb-4">
                <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}

export const EmploymentDetails = withAuthorization(EmploymentDetailsView, {
  permission: "employment.view",
})
