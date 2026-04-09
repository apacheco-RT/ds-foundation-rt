import { Check, X } from "lucide-react"
import { cn } from "./utils"
import { Caption } from "./Typography"

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

function Stepper({ steps, className }: StepperProps) {
  return (
    <ol role="list" className={cn("flex items-start gap-0", className)}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        const prevComplete = idx > 0 && steps[idx - 1]?.status === "complete"
        const circleClass = cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors",
          {
            "bg-blue-500 border-blue-500 text-white": step.status === "complete",
            "border-blue-500 text-blue-500 bg-ds-bg": step.status === "active",
            "border-orange-400 text-orange-400 bg-ds-bg": step.status === "error",
            "border-ds-border text-ds-text-muted bg-ds-bg": step.status === "pending",
          }
        )
        return (
          <li key={idx} role="listitem" aria-current={step.status === "active" ? "step" : undefined} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {idx > 0 && <div className={cn("h-0.5 flex-1", prevComplete ? "bg-blue-500" : "bg-ds-border")} />}
              <div className={circleClass}>
                {step.status === "complete" && <Check className="w-4 h-4" />}
                {step.status === "error" && <X className="w-4 h-4" />}
                {(step.status === "active" || step.status === "pending") && idx + 1}
              </div>
              {!isLast && <div className={cn("h-0.5 flex-1", step.status === "complete" ? "bg-blue-500" : "bg-ds-border")} />}
            </div>
            <Caption className={cn("mt-2 text-center px-1", {
              "text-blue-500 font-medium": step.status === "active",
              "text-ds-text": step.status === "complete",
              "text-orange-400": step.status === "error",
              "text-ds-text-muted": step.status === "pending",
            })}>
              {step.label}
            </Caption>
            {step.description && <Caption className="text-ds-text-muted text-center px-1 mt-0.5">{step.description}</Caption>}
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper }
export type { Step, StepStatus }
