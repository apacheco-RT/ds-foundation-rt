import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "../utils"
import { Caption } from "../atoms/Typography"

type StepStatus = "pending" | "active" | "complete" | "error"

interface Step {
  label: string
  description?: string
  status: StepStatus
}

export interface StepperProps {
  steps: Step[]
  className?: string
}

const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(({ steps, className }, ref) => (
  <ol ref={ref} role="list" className={cn("flex items-start gap-0", className)}>
    {steps.map((step, idx) => {
      const isLast = idx === steps.length - 1
      const prevComplete = idx > 0 && steps[idx - 1]?.status === "complete"
      const circleClass = cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors",
        {
          "bg-ds-primary border-ds-primary text-white": step.status === "complete",
          "border-ds-primary text-ds-primary bg-ds-bg": step.status === "active",
          "border-ds-warning text-ds-warning bg-ds-bg": step.status === "error",
          "border-ds-border text-ds-text-muted bg-ds-bg": step.status === "pending",
        }
      )
      return (
        <li key={idx} role="listitem" aria-current={step.status === "active" ? "step" : undefined} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            {idx > 0 && <div className={cn("h-0.5 flex-1", prevComplete ? "bg-ds-primary" : "bg-ds-border")} />}
            <div className={circleClass}>
              {step.status === "complete" && <Check className="w-4 h-4" />}
              {step.status === "error" && <X className="w-4 h-4" />}
              {(step.status === "active" || step.status === "pending") && idx + 1}
            </div>
            {!isLast && <div className={cn("h-0.5 flex-1", step.status === "complete" ? "bg-ds-primary" : "bg-ds-border")} />}
          </div>
          <Caption className={cn("mt-2 text-center px-1", {
            "text-ds-primary font-medium": step.status === "active",
            "text-ds-text": step.status === "complete",
            "text-ds-warning": step.status === "error",
            "text-ds-text-muted": step.status === "pending",
          })}>
            {step.label}
          </Caption>
          {step.description && <Caption className="text-ds-text-muted text-center px-1 mt-0.5">{step.description}</Caption>}
        </li>
      )
    })}
  </ol>
))
Stepper.displayName = "Stepper"

export { Stepper }
export type { Step, StepStatus }
