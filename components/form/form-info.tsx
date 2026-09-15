import { Info } from "lucide-react"

export function FormInfo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm leading-5 text-sky-800">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
