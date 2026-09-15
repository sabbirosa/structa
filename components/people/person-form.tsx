"use client"

import {
  FormErrorAlert,
  FormFieldInput,
  FormFieldSelect,
  FormInfo,
  FormSuccessAlert,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { peopleApi } from "@/lib/api/people"
import type { Person } from "@/types/workforce"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid work email"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  employmentStatus: z.enum(["Active", "On leave", "Inactive"]),
  classification: z.string().min(1, "Classification is required"),
  location: z.string().trim().min(1, "Location is required"),
})

type FormValues = z.infer<typeof schema>

export function PersonForm({
  person,
  onSaved,
}: {
  person: Person
  onSaved?: (person: Person) => void
}) {
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: person,
  })

  const submit = handleSubmit(
    async (values) => {
      setSaveError(null)
      setSuccess(null)
      try {
        const saved = await peopleApi.update({ ...person, ...values })
        setSuccess("Person details saved successfully.")
        onSaved?.(saved)
      } catch (cause) {
        setSaveError(
          cause instanceof Error
            ? cause.message
            : "The person could not be saved."
        )
      }
    },
    () => setSaveError("Resolve the highlighted fields before saving.")
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormErrorAlert message={saveError} />
      <FormSuccessAlert message={success} />
      <FormInfo>
        Employment status controls access to internal systems. Confirm any
        change with the person&apos;s manager.
      </FormInfo>
      <section>
        <h2 className="text-base font-semibold text-foreground">
          Personal information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The person&apos;s preferred identity and primary contact details.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormFieldInput
            label="First name"
            required
            registration={register("firstName")}
            error={errors.firstName?.message}
          />
          <FormFieldInput
            label="Last name"
            required
            registration={register("lastName")}
            error={errors.lastName?.message}
          />
          <FormFieldInput
            label="Work email"
            required
            type="email"
            registration={register("email")}
            error={errors.email?.message}
          />
          <FormFieldInput
            label="Phone"
            required
            registration={register("phone")}
            error={errors.phone?.message}
          />
        </div>
      </section>
      <div className="border-t border-border" />
      <section>
        <h2 className="text-base font-semibold text-foreground">
          Work profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Placement, classification, and current workforce status.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormFieldInput
            label="Job title"
            required
            registration={register("jobTitle")}
            error={errors.jobTitle?.message}
          />
          <FormFieldSelect
            label="Department"
            required
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
            label="Employment status"
            required
            control={control}
            name="employmentStatus"
            options={["Active", "On leave", "Inactive"]}
            error={errors.employmentStatus?.message}
          />
          <FormFieldSelect
            label="Classification"
            required
            control={control}
            name="classification"
            options={[
              "Associate",
              "Professional",
              "Senior professional",
              "Manager",
              "Director",
              "Executive",
            ]}
            error={errors.classification?.message}
          />
          <FormFieldInput
            label="Location"
            required
            registration={register("location")}
            error={errors.location?.message}
          />
        </div>
      </section>
      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="size-4" />
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
