import * as React from "react"
import { cn } from "../utils"
import { H5, Body } from "../atoms/Typography"
import { Button } from "../atoms/Button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center text-center py-12 px-6", className)}
      {...props}
    >
      {icon && <div className="w-12 h-12 text-ds-text-muted mb-4 flex items-center justify-center">{icon}</div>}
      <H5 className="text-ds-text mb-2">{title}</H5>
      {description && <Body className="text-ds-text-muted max-w-sm mb-6">{description}</Body>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
