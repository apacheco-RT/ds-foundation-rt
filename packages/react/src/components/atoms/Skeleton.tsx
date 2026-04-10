import * as React from "react"
import { cn } from "../utils"
import { useReducedMotion } from "../utils/useReducedMotion"

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md bg-ds-sunken",
          !prefersReducedMotion && "animate-pulse",
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
