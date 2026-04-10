import * as React from "react"
import { cn } from "../utils"

type WindowStatus = 'open' | 'closing' | 'closed'

const STATUS_CLASS: Record<WindowStatus, string> = {
  open:    'bg-ds-success',
  closing: 'bg-ds-warning animate-pulse',
  closed:  'bg-ds-text-muted',
}

export interface BankingWindowDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: WindowStatus
  size?: number
}

const BankingWindowDot = React.forwardRef<HTMLSpanElement, BankingWindowDotProps>(
  ({ status, size = 6, className, style, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('inline-block rounded-full', STATUS_CLASS[status], className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  )
)
BankingWindowDot.displayName = 'BankingWindowDot'

export { BankingWindowDot, type WindowStatus }
