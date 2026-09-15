import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CircleHelp } from "lucide-react"
import type { InputHTMLAttributes } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { RequiredAsterisk } from "./required-asterisk"

interface FormFieldInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  label: string
  registration: UseFormRegisterReturn
  error?: string
  required?: boolean
  hint?: string
}

export function FormFieldInput({
  label,
  registration,
  error,
  required,
  hint,
  className,
  ...props
}: FormFieldInputProps) {
  const id = `field-${registration.name}`
  return (
    <div className="space-y-1.5">
      <div className="flex w-full items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-1 text-sm font-medium text-foreground"
        >
          {label}
          {required && <RequiredAsterisk />}
        </label>
        {hint && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={`Help for ${label}`}
                  className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              <CircleHelp className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" align="end">
              {hint}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Input
        id={id}
        {...registration}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-10 bg-background px-3 shadow-sm focus-visible:border-primary focus-visible:ring-primary/15 disabled:bg-muted",
          className
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
