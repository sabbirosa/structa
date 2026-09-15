import { CheckCircle2 } from "lucide-react"

export function FormSuccessAlert({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5"
    >
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="size-4.5 text-emerald-600" />
        <p className="text-sm font-medium text-emerald-800">{message}</p>
      </div>
    </div>
  )
}
