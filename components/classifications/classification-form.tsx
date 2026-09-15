"use client"

import {
  FormErrorAlert,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
  FormInfo,
  FormSuccessAlert,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { classificationsApi } from "@/lib/api/classifications"
import type { Classification } from "@/types/workforce"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  code: z
    .string()
    .trim()
    .min(2, "Code is required")
    .max(8, "Use 8 characters or fewer")
    .regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers, or hyphens only"),
  description: z
    .string()
    .trim()
    .min(12, "Add a useful description of at least 12 characters"),
  status: z.enum(["Active", "Archived"]),
})
type Values = z.infer<typeof schema>

export function ClassificationForm({
  classification,
  onSaved,
}: {
  classification: Classification
  onSaved: (classification: Classification) => void
}) {
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: classification,
  })
  const submit = handleSubmit(
    async (values) => {
      setSaveError(null)
      setSuccess(null)
      try {
        const saved = await classificationsApi.save({
          ...classification,
          ...values,
          code: values.code.toUpperCase(),
          lastUpdated: new Date().toISOString().slice(0, 10),
        })
        setSuccess("Classification saved successfully.")
        onSaved(saved)
      } catch (cause) {
        setSaveError(
          cause instanceof Error
            ? cause.message
            : "The classification could not be saved."
        )
      }
    },
    () => setSaveError("Resolve the highlighted fields before saving.")
  )
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormErrorAlert message={saveError} />
      <FormSuccessAlert message={success} />
      <FormInfo>
        Classification codes appear in workforce exports and downstream HR
        systems. Keep codes short and stable.
      </FormInfo>
      <FormFieldInput
        label="Classification name"
        required
        registration={register("name")}
        error={errors.name?.message}
        placeholder="e.g. Senior specialist"
      />
      <FormFieldInput
        label="Code"
        required
        registration={register("code")}
        error={errors.code?.message}
        placeholder="e.g. SR-SPEC"
        hint="2–8 letters, numbers, or hyphens."
      />
      <FormFieldTextarea
        label="Description"
        required
        registration={register("description")}
        error={errors.description?.message}
        placeholder="Explain when this classification should be used…"
      />
      <FormFieldSelect
        label="Status"
        required
        control={control}
        name="status"
        options={["Active", "Archived"]}
        error={errors.status?.message}
      />
      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {isSubmitting ? "Saving…" : "Save classification"}
        </Button>
      </div>
    </form>
  )
}
