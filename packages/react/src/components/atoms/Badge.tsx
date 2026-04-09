import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../utils"

type BadgeVariant = 'solid' | 'subtle' | 'outline'
type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type BadgeSize = 'sm' | 'md'

const COLOR_STYLES: Record<BadgeColor, Record<BadgeVariant, React.CSSProperties>> = {
  primary: {
    subtle:  { backgroundColor: 'var(--ds-primary-subtle)', color: 'var(--ds-primary)', borderColor: 'var(--ds-primary)' },
    solid:   { backgroundColor: 'var(--ds-primary)', color: 'var(--ds-primary-fg)', borderColor: 'var(--ds-primary)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-primary)', borderColor: 'var(--ds-primary)' },
  },
  success: {
    subtle:  { backgroundColor: 'var(--ds-feedback-success-bg)', color: 'var(--ds-feedback-success-text)', borderColor: 'var(--ds-feedback-success-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-success-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-success-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-success-text)', borderColor: 'var(--ds-feedback-success-border)' },
  },
  warning: {
    subtle:  { backgroundColor: 'var(--ds-feedback-warning-bg)', color: 'var(--ds-feedback-warning-text)', borderColor: 'var(--ds-feedback-warning-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-warning-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-warning-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-warning-text)', borderColor: 'var(--ds-feedback-warning-border)' },
  },
  danger: {
    subtle:  { backgroundColor: 'var(--ds-feedback-error-bg)', color: 'var(--ds-feedback-error-text)', borderColor: 'var(--ds-feedback-error-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-error-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-error-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-error-text)', borderColor: 'var(--ds-feedback-error-border)' },
  },
  info: {
    subtle:  { backgroundColor: 'var(--ds-feedback-info-bg)', color: 'var(--ds-feedback-info-text)', borderColor: 'var(--ds-feedback-info-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-info-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-info-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-info-text)', borderColor: 'var(--ds-feedback-info-border)' },
  },
  neutral: {
    subtle:  { backgroundColor: 'var(--ds-bg)', color: 'var(--ds-text-muted)', borderColor: 'var(--ds-border)' },
    solid:   { backgroundColor: 'var(--ds-surface-up)', color: 'var(--ds-text)', borderColor: 'var(--ds-surface-up)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-text-muted)', borderColor: 'var(--ds-border)' },
  },
}

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  dot?: boolean
}

function Badge({
  className,
  variant = 'subtle',
  color = 'neutral',
  size = 'md',
  dot,
  style,
  children,
  ...props
}: BadgeProps) {
  const colorStyle = COLOR_STYLES[color][variant]
  return (
    <span
      className={cn(badgeVariants({ size }), className)}
      style={{ ...colorStyle, ...style }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
