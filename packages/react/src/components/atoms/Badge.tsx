import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../utils"

type BadgeVariant = 'solid' | 'subtle' | 'outline'
type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type BadgeSize = 'sm' | 'md'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
      variant:  { subtle: '', solid: '', outline: '' },
      color:    { primary: '', success: '', warning: '', danger: '', info: '', neutral: '' },
    },
    compoundVariants: [
      // ── Primary ──────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'primary',
        className: 'bg-ds-primary-subtle text-ds-primary border-ds-primary' },
      { variant: 'solid',   color: 'primary',
        className: 'bg-ds-primary text-ds-primary-fg border-transparent' },
      { variant: 'outline', color: 'primary',
        className: 'bg-transparent text-ds-primary border-ds-primary' },
      // ── Success ──────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'success',
        className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border' },
      { variant: 'solid',   color: 'success',
        className: 'bg-ds-success text-ds-text-inverse border-transparent' },
      { variant: 'outline', color: 'success',
        className: 'bg-transparent text-ds-success-text border-ds-success-border' },
      // ── Warning ──────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'warning',
        className: 'bg-ds-feedback-warning-bg text-ds-warning-text border-ds-warning-border' },
      { variant: 'solid',   color: 'warning',
        className: 'bg-ds-warning text-ds-text-inverse border-transparent' },
      { variant: 'outline', color: 'warning',
        className: 'bg-transparent text-ds-warning-text border-ds-warning-border' },
      // ── Danger ───────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'danger',
        className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border' },
      { variant: 'solid',   color: 'danger',
        className: 'bg-ds-danger text-ds-text-inverse border-transparent' },
      { variant: 'outline', color: 'danger',
        className: 'bg-transparent text-ds-danger-text border-ds-danger-border' },
      // ── Info ─────────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'info',
        className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
      { variant: 'solid',   color: 'info',
        className: 'bg-ds-info text-ds-text-inverse border-transparent' },
      { variant: 'outline', color: 'info',
        className: 'bg-transparent text-ds-info-text border-ds-info-border' },
      // ── Neutral ──────────────────────────────────────────────────────────
      { variant: 'subtle',  color: 'neutral',
        className: 'bg-ds-bg text-ds-text-muted border-ds-border' },
      { variant: 'solid',   color: 'neutral',
        className: 'bg-ds-surface-up text-ds-text border-transparent' },
      { variant: 'outline', color: 'neutral',
        className: 'bg-transparent text-ds-text-muted border-ds-border' },
    ],
    defaultVariants: { size: 'md', variant: 'subtle', color: 'neutral' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  className,
  variant = 'subtle',
  color = 'neutral',
  size = 'md',
  dot,
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ size, variant, color }), className)}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
