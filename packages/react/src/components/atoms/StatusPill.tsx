import * as React from "react"
import { cn } from "../utils"

type InstructionStatus = 'submitted' | 'in_payments' | 'first_approval' | 'second_approval' | 'sent_to_bank' | 'bank_confirmed' | 'failed' | 'rejected'

const STATUS_CONFIG: Record<InstructionStatus, { label: string; className: string }> = {
  submitted:       { label: 'Submitted',    className: 'bg-ds-surface-up text-ds-text-muted border-ds-border' },
  in_payments:     { label: 'In Payments',  className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  first_approval:  { label: '1st Approval', className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  second_approval: { label: '2nd Approval', className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  sent_to_bank:    { label: 'Sent to Bank', className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border' },
  bank_confirmed:  { label: 'Confirmed ✓',  className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border' },
  failed:          { label: 'Failed',       className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border' },
  rejected:        { label: 'Rejected',     className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border' },
}

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: InstructionStatus
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, className, ...props }, ref) => {
    const { label, className: colorClass } = STATUS_CONFIG[status]
    return (
      <span
        ref={ref}
        role="status"
        aria-label={`Status: ${label}`}
        className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border', colorClass, className)}
        {...props}
      >
        {label}
      </span>
    )
  }
)
StatusPill.displayName = 'StatusPill'

export { StatusPill, type InstructionStatus }
