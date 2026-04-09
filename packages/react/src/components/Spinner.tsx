import { cn } from "./utils"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: { size: "md" },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

function Spinner({ size, className }: SpinnerProps) {
  return (
    <span role="status" aria-label="Loading">
      <svg
        className={cn(spinnerVariants({ size }), className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth={size === "lg" ? 2.5 : 2}
          strokeLinecap="round"
          strokeDasharray="47 16"
          opacity="0.25"
        />
        <circle
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth={size === "lg" ? 2.5 : 2}
          strokeLinecap="round"
          strokeDasharray="47 16"
        />
      </svg>
      <span className="sr-only">Loading…</span>
    </span>
  )
}

export { Spinner }
