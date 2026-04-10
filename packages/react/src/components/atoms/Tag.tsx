import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../utils"

const tagVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-ds-surface-up text-ds-text-muted border border-ds-border',
        blue:    'bg-ds-feedback-info-bg text-ds-info-text border border-ds-info-border',
        green:   'bg-ds-feedback-success-bg text-ds-success-text border border-ds-success-border',
        error:   'bg-ds-feedback-error-bg text-ds-danger-text border border-ds-danger-border',
        orange:  'bg-ds-feedback-warning-bg text-ds-warning-text border border-ds-warning-border',
        purple:  'bg-ds-primary-subtle text-ds-primary border border-ds-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
  icon?: React.ReactNode
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, onRemove, icon, children, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ variant }), className)} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
)
Tag.displayName = 'Tag'

export { Tag }
