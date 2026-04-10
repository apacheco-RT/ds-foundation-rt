import * as React from "react"
import { cn } from "../utils"

export interface CurrencyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: 'USD' | 'EUR' | 'GBP'
}

const CurrencyBadge = React.forwardRef<HTMLSpanElement, CurrencyBadgeProps>(
  ({ currency, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={`Currency: ${currency}`}
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold font-mono tracking-wide',
        'bg-ds-surface-up text-ds-text-muted border border-ds-border',
        className
      )}
      {...props}
    >
      {currency}
    </span>
  )
)
CurrencyBadge.displayName = 'CurrencyBadge'

export { CurrencyBadge }
