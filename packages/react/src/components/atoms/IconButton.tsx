import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

type IconButtonVariant = 'info' | 'success' | 'primary' | 'warning' | 'danger' | 'neutral'
type IconButtonSize = 'sm' | 'md'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 p-0.5',
        md: 'h-7 w-7 p-1',
      },
      variant: {
        info:    'text-ds-text-muted hover:text-ds-info hover:bg-ds-feedback-info-bg',
        success: 'text-ds-text-muted hover:text-ds-success-text hover:bg-ds-feedback-success-bg',
        primary: 'text-ds-text-muted hover:text-ds-primary hover:bg-ds-primary-subtle',
        warning: 'text-ds-text-muted hover:text-ds-warning-text hover:bg-ds-feedback-warning-bg',
        danger:  'text-ds-text-muted hover:text-ds-danger-text hover:bg-ds-feedback-error-bg',
        neutral: 'text-ds-text-muted hover:text-ds-text hover:bg-ds-surface-up',
      },
    },
    defaultVariants: { size: 'md', variant: 'neutral' },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size }), children ? 'gap-1 px-2 w-auto' : '', className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
)
IconButton.displayName = 'IconButton'

export { IconButton }
