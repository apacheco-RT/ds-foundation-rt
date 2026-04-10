import * as React from "react"
import { cn } from "../utils"

export interface TwoColumnLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode
  right: React.ReactNode
  /** Grid template columns, e.g. "1fr 1fr" or "2fr 1fr" */
  columns?: string
}

const TwoColumnLayout = React.forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  ({ left, right, columns = "1fr 1fr", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid h-full", className)}
      style={{ gridTemplateColumns: columns }}
      {...props}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
)
TwoColumnLayout.displayName = "TwoColumnLayout"

export { TwoColumnLayout }
