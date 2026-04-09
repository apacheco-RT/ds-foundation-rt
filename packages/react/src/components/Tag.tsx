import * as React from "react"
import { X } from "lucide-react"
import { cn } from "./utils"
import { cva, type VariantProps } from "class-variance-authority"

const tagVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-400",
        error: "bg-orange-100 text-orange-400",
        orange: "bg-orange-200 text-orange-500",
        purple: "bg-purple-100 text-purple-400",
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
