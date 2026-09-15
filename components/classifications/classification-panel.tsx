"use client"

import { ClassificationForm } from "@/components/classifications/classification-form"
import { StatusBadge } from "@/components/common/status-badge"
import type { Classification } from "@/types/workforce"
import { X } from "lucide-react"

export function ClassificationPanel({
  classification,
  editing,
  onClose,
  onSaved,
}: {
  classification: Classification
  editing: boolean
  onClose: () => void
  onSaved: (classification: Classification) => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit classification" : "Classification details"}
    >
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close panel overlay"
      />
      <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-card text-card-foreground shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card px-6 py-5">
          <div>
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
              {classification.id}
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {editing
                ? classification.id === "C-NEW"
                  ? "Create classification"
                  : "Edit classification"
                : classification.name}
            </h2>
          </div>
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="p-6">
          {editing ? (
            <ClassificationForm
              classification={classification}
              onSaved={onSaved}
            />
          ) : (
            <dl className="space-y-5">
              {[
                ["Code", classification.code],
                ["Description", classification.description],
                [
                  "Status",
                  <StatusBadge key="status" value={classification.status} />,
                ],
                ["Assigned people", classification.assignedPeople],
                ["Last updated", classification.lastUpdated],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="border-b border-border pb-4"
                >
                  <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6 font-medium text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </aside>
    </div>
  )
}
