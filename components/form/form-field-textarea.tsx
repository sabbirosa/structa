import { Textarea } from "@/components/ui/textarea"
import type { TextareaHTMLAttributes } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { RequiredAsterisk } from "./required-asterisk"

export function FormFieldTextarea({
  label,
  registration,
  error,
  required,
  ...props
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> & {
  label: string
  registration: UseFormRegisterReturn
  error?: string
  required?: boolean
}) {
  const id = `field-${registration.name}`
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-medium text-foreground"
      >
        {label}
        {required && <RequiredAsterisk />}
      </label>
      <Textarea
        id={id}
        {...registration}
        {...props}
        aria-invalid={Boolean(error)}
        className="min-h-24 bg-background px-3 py-2 shadow-sm focus-visible:border-primary focus-visible:ring-primary/15"
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
