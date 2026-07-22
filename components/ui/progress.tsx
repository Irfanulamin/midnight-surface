"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * shadcn progress, retoned for this project.
 *
 * The generated version referenced `bg-muted` and `bg-primary`, which are
 * shadcn's own CSS variables — this project never ran shadcn's init, so
 * `globals.css` is hand-built and has no such tokens. Both are mapped onto the
 * real palette instead: the track is ink at 15% and the fill is solid ink,
 * matching the rule the design already draws beside the slide counter.
 *
 * The indicator moves by transform, as generated, so the fill animates on the
 * compositor rather than laying out a width on every frame.
 */
function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /**
   * Applied to the fill. Lets a caller drive it by CSS animation instead of by
   * `value` — see `.progress-fill` in globals.css, which runs the bar as a
   * countdown. A CSS animation outranks the inline transform below while it is
   * running, so the two cannot fight.
   */
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-px w-full items-center overflow-x-hidden rounded-full bg-ink/15",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "size-full flex-1 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
