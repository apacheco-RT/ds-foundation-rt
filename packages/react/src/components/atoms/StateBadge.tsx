import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral'

const stateBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
  {
    variants: {
      intent: {
        info:    'bg-ds-feedback-info-bg text-ds-info-text border border-ds-info-border',
        warning: 'bg-ds-feedback-warning-bg text-ds-warning-text border border-ds-warning-border',
        success: 'bg-ds-feedback-success-bg text-ds-success-text border border-ds-success-border',
        error:   'bg-ds-feedback-error-bg text-ds-danger-text border border-ds-danger-border',
        neutral: 'bg-ds-surface-up text-ds-text-muted border border-ds-border',
      },
    },
    defaultVariants: { intent: 'neutral' },
  }
)

export interface StateBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stateBadgeVariants> {
  state: string
  nextState?: string
}

const StateBadge = React.forwardRef<HTMLSpanElement, StateBadgeProps>(
  ({ state, nextState, intent, className, ...props }, ref) => {
    const label = nextState ? `${state}, next: ${nextState}` : state
    return (
      <span
        ref={ref}
        role="status"
        aria-label={`Status: ${label}`}
        className={cn(stateBadgeVariants({ intent }), className)}
        {...props}
      >
        {state}
        {nextState && (
          <>
            <span aria-hidden="true"> → </span>
            <span>{nextState}</span>
          </>
        )}
      </span>
    )
  }
)
StateBadge.displayName = 'StateBadge'

export { StateBadge, type StateBadgeIntent }
