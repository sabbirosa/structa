"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RequiredAsterisk() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label="Required field"
            className="cursor-help text-destructive"
            role="img"
            tabIndex={0}
          />
        }
      >
        *
      </TooltipTrigger>
      <TooltipContent side="top">Required</TooltipContent>
    </Tooltip>
  )
}
