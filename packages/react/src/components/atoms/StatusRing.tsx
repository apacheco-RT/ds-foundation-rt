import * as React from "react"
import { cn } from "../utils"

type Urgency = 'critical' | 'watch' | 'clear' | 'skip'

const URGENCY_COLOR: Record<Urgency, string> = {
  critical: 'bg-ds-danger border-ds-danger',
  watch:    'bg-ds-warning border-ds-warning',
  clear:    'bg-ds-success border-ds-success',
  skip:     'bg-ds-primary border-ds-primary',
}

export interface StatusRingProps extends React.HTMLAttributes<HTMLSpanElement> {
  urgency: Urgency
  size?: 'sm' | 'md'
  pulse?: boolean
}

const StatusRing = React.forwardRef<HTMLSpanElement, StatusRingProps>(
  ({ urgency, size = 'md', pulse = false, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'inline-block rounded-full border-2',
        size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
        URGENCY_COLOR[urgency],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    />
  )
)
StatusRing.displayName = 'StatusRing'

export { StatusRing, type Urgency }
