import * as React from "react"
import { cn } from "../utils"

type UrgencyLevel = 'critical' | 'watch' | 'clear' | 'skip'

const DEFAULT_LABELS: Record<UrgencyLevel, string> = {
  critical: 'Critical',
  watch:    'Watch',
  clear:    'Clear',
  skip:     'Skip-node',
}

const URGENCY_CLASS: Record<UrgencyLevel, string> = {
  critical: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border',
  watch:    'bg-ds-feedback-warning-bg text-ds-warning-text border-ds-warning-border',
  clear:    'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border',
  skip:     'bg-ds-primary-subtle text-ds-primary border-ds-primary',
}

export interface UrgencyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  urgency: UrgencyLevel
  label?: string
}

const UrgencyBadge = React.forwardRef<HTMLSpanElement, UrgencyBadgeProps>(
  ({ urgency, label, className, ...props }, ref) => {
    const text = label ?? DEFAULT_LABELS[urgency]
    return (
      <span
        ref={ref}
        aria-label={`Urgency: ${text}`}
        className={cn(
          'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold border',
          URGENCY_CLASS[urgency],
          className
        )}
        {...props}
      >
        {text}
      </span>
    )
  }
)
UrgencyBadge.displayName = 'UrgencyBadge'

export { UrgencyBadge, type UrgencyLevel }
