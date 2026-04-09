import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        secondary: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        success: "border-transparent bg-green-300 text-white hover:bg-green-400",
        warning: "border-transparent bg-orange-300 text-white hover:bg-orange-400",
        info: "border-transparent bg-purple-300 text-white hover:bg-purple-400",
        pink: "border-transparent bg-pink-300 text-white hover:bg-pink-400",
        destructive: "border-transparent bg-orange-400 text-white hover:bg-orange-500",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
