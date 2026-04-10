import * as React from "react"
import { cn } from "../utils"

export interface DetailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}

const DetailCard = React.forwardRef<HTMLDivElement, DetailCardProps>(
  ({ title, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg bg-ds-surface border border-ds-border p-4', className)}
      {...props}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ds-primary border-b border-ds-border pb-2 mb-3">
        {title}
      </h4>
      {children}
    </div>
  )
)
DetailCard.displayName = 'DetailCard'

export { DetailCard }
