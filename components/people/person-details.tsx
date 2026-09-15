"use client"

import { ErrorState } from "@/components/common/error-state"
import { StatusBadge } from "@/components/common/status-badge"
import { PersonForm } from "@/components/people/person-form"
import { Can } from "@/components/permissions/can"
import { withAuthorization } from "@/components/permissions/with-authorization"
import { Button } from "@/components/ui/button"
import { useApiData } from "@/hooks/use-api-data"
import { peopleApi } from "@/lib/api/people"
import { can } from "@/lib/permissions"
import { useRoleStore } from "@/stores/role-store"
import type { Person } from "@/types/workforce"
import {
  ArrowLeft,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const blankPerson: Person = {
  id: "P-NEW",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  department: "Engineering",
  employmentStatus: "Active",
  classification: "Professional",
  location: "",
}

function PersonDetailsView({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const role = useRoleStore((state) => state.role)
  const mayEdit = can(role, "person.edit")
  const request = useCallback(
    () => (id === "new" ? Promise.resolve(blankPerson) : peopleApi.get(id)),
    [id]
  )
  const { data, setData, loading, error, retry } = useApiData(request)
  const [editing, setEditing] = useState(
    mayEdit && (id === "new" || searchParams.get("edit") === "1")
  )
  const isEditing = editing && mayEdit
  if (loading)
    return (
      <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
    )
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <ErrorState message="This person could not be found." />
  const person = data
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/people"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to people
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
            {person.firstName?.[0] ?? "N"}
            {person.lastName?.[0] ?? "P"}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
              {id === "new" ? "New profile" : person.id}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {id === "new"
                ? "Add a person"
                : `${person.firstName} ${person.lastName}`}
            </h1>
            {id !== "new" && (
              <p className="mt-1 text-sm text-muted-foreground">
                {person.jobTitle} · {person.department}
              </p>
            )}
          </div>
        </div>
        {!isEditing && (
          <Can permission="person.edit">
            <Button onClick={() => setEditing(true)}>
              <Pencil className="size-4" />
              Edit person
            </Button>
          </Can>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
        {isEditing ? (
          <PersonForm
            person={person}
            onSaved={(saved) => {
              setData(saved)
              setEditing(false)
            }}
          />
        ) : (
          <div className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                icon={UserRound}
                title="Personal information"
                rows={[
                  ["Full name", `${person.firstName} ${person.lastName}`],
                  ["Employee ID", person.id],
                ]}
              />
              <DetailCard
                icon={Mail}
                title="Contact information"
                rows={[
                  ["Email", person.email],
                  ["Phone", person.phone],
                  ["Location", person.location],
                ]}
              />
              <DetailCard
                icon={BriefcaseBusiness}
                title="Employment information"
                rows={[
                  ["Job title", person.jobTitle],
                  ["Department", person.department],
                ]}
              />
              <DetailCard
                icon={ShieldCheck}
                title="Classification & status"
                rows={[
                  ["Classification", person.classification],
                  [
                    "Status",
                    <StatusBadge
                      key="status"
                      value={person.employmentStatus}
                    />,
                  ],
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const PersonDetails = withAuthorization(PersonDetailsView, {
  permission: ({ id }) => (id === "new" ? "person.edit" : "person.view"),
})

function DetailCard({
  icon: Icon,
  title,
  rows,
}: {
  icon: typeof MapPin
  title: string
  rows: [string, React.ReactNode][]
}) {
  return (
    <section className="rounded-xl border border-border p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-medium text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
