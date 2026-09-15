import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-900">
            Something went wrong
          </p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-red-200 bg-white text-red-700"
              onClick={onRetry}
            >
              <RotateCcw className="size-3.5" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
