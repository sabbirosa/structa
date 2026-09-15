import { cn } from "@/lib/utils"

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
      : value === "On leave"
        ? "bg-amber-50 text-amber-700 ring-amber-600/15"
        : "bg-slate-100 text-slate-600 ring-slate-500/15"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
        tone
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          value === "Active"
            ? "bg-emerald-500"
            : value === "On leave"
              ? "bg-amber-500"
              : "bg-slate-400"
        )}
      />
      {value}
    </span>
  )
}
