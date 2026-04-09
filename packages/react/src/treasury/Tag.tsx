import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../components/utils"
import { cva, type VariantProps } from "class-variance-authority"

const tagVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-ds-surface-up text-ds-text-muted",
        blue: "bg-ds-primary-subtle text-ds-primary",
        green: "bg-ds-surface text-ds-success",
        error: "bg-ds-surface text-ds-warning",
        orange: "bg-ds-surface text-ds-warning",
        purple: "bg-purple-100 text-purple-400", /* TODO: needs ds-feedback-purple token */
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface TagProps extends VariantProps<typeof tagVariants> {
  children: React.ReactNode
  onRemove?: () => void
  icon?: React.ReactNode
  className?: string
}

function Tag({ children, variant, onRemove, icon, className }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button" onClick={onRemove} aria-label="Remove"
          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

export { Tag }
