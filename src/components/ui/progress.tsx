"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-500 ease-in-out shadow-[0_0_15px_rgba(109,40,217,0.5)]"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
