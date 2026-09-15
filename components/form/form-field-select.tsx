import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { RequiredAsterisk } from "./required-asterisk"

export function FormFieldSelect<TFieldValues extends FieldValues>({
  label,
  control,
  name,
  options,
  error,
  required,
  disabled,
}: {
  label: string
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  options: readonly string[]
  error?: string
  required?: boolean
  disabled?: boolean
}) {
  const id = `field-${name}`
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-medium text-foreground"
      >
        {label}
        {required && <RequiredAsterisk />}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value as string}
            onValueChange={(value) => field.onChange(value)}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              aria-invalid={Boolean(error)}
              className="h-10 w-full bg-background px-3 shadow-sm disabled:bg-muted"
            >
              <SelectValue>{String(field.value ?? "")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
