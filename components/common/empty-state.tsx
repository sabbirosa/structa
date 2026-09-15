import { SearchX } from "lucide-react"

export function EmptyState({
  title = "No results found",
  description = "Try changing or clearing your search and filters.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
