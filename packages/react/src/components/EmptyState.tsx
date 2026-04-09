import * as React from "react"
import { cn } from "./utils"
import { H5, Body } from "./Typography"
import { Button } from "./Button"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6", className)}>
      {icon && <div className="w-12 h-12 text-ds-text-muted mb-4 flex items-center justify-center">{icon}</div>}
      <H5 className="text-ds-text mb-2">{title}</H5>
      {description && <Body className="text-ds-text-muted max-w-sm mb-6">{description}</Body>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}

export { EmptyState }
