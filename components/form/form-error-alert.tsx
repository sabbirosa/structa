import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export function FormErrorAlert({
  message,
  className,
}: {
  message?: string | null
  className?: string
}) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-red-200 bg-red-50 p-3.5",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-900">
            Please check the form
          </p>
          <p className="mt-0.5 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  )
}
