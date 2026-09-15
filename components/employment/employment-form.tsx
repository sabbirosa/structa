"use client"

import {
  FormErrorAlert,
  FormFieldInput,
  FormFieldSelect,
  FormInfo,
  FormSuccessAlert,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { employmentApi } from "@/lib/api/employment"
import { useRoleStore } from "@/stores/role-store"
import type { Employment } from "@/types/workforce"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z
  .object({
    position: z.string().trim().min(1, "Position is required"),
    department: z.string().min(1),
    employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string(),
    status: z.enum(["Active", "On leave", "Inactive"]),
    manager: z.string().trim().min(1, "Manager is required"),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  })
type Values = z.infer<typeof schema>

export function EmploymentForm({
  record,
  onSaved,
}: {
  record: Employment
  onSaved?: (record: Employment) => void
}) {
  const role = useRoleStore((state) => state.role)
  const restricted = role === "MANAGER"
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { ...record, endDate: record.endDate ?? "" },
  })
  const submit = handleSubmit(
    async (values) => {
      setSaveError(null)
      setSuccess(null)
      try {
        const saved = await employmentApi.update({
          ...record,
          ...values,
          endDate: values.endDate || null,
        })
        setSuccess("Employment details saved successfully.")
        onSaved?.(saved)
      } catch (cause) {
        setSaveError(
          cause instanceof Error
            ? cause.message
            : "Employment details could not be saved."
        )
      }
    },
    () => setSaveError("Resolve the highlighted fields before saving.")
  )
  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <FormErrorAlert message={saveError} />
      <FormSuccessAlert message={success} />
      {restricted && (
        <FormInfo>
          Managers can update employment status and end dates. Position,
          department, employment type, start date, and manager are controlled by
          People Operations.
        </FormInfo>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldInput
          label="Position"
          required
          disabled={restricted}
          registration={register("position")}
          error={errors.position?.message}
        />
        <FormFieldSelect
          label="Department"
          required
          disabled={restricted}
          control={control}
          name="department"
          options={[
            "Engineering",
            "Finance",
            "Legal",
            "Operations",
            "People",
            "Product",
            "Sales",
          ]}
          error={errors.department?.message}
        />
        <FormFieldSelect
          label="Employment type"
          required
          disabled={restricted}
          control={control}
          name="employmentType"
          options={["Full-time", "Part-time", "Contract"]}
          error={errors.employmentType?.message}
        />
        <FormFieldInput
          label="Manager"
          required
          disabled={restricted}
          registration={register("manager")}
          error={errors.manager?.message}
        />
        <FormFieldInput
          label="Start date"
          required
          type="date"
          disabled={restricted}
          registration={register("startDate")}
          error={errors.startDate?.message}
        />
        <FormFieldInput
          label="End date"
          type="date"
          registration={register("endDate")}
          error={errors.endDate?.message}
          hint="Leave empty for ongoing employment."
        />
        <FormFieldSelect
          label="Status"
          required
          control={control}
          name="status"
          options={["Active", "On leave", "Inactive"]}
          error={errors.status?.message}
        />
      </div>
      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
