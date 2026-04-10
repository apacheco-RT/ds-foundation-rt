import * as React from "react"
import { cn } from "../utils"
import { Caption, Body } from "../atoms/Typography"

type TimelineStatus = "default" | "active" | "complete" | "error"

interface TimelineItem {
  id: string
  icon?: React.ReactNode
  title: string
  description?: string
  timestamp?: string
  status?: TimelineStatus
}

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[]
}

const dotColor: Record<TimelineStatus, string> = {
  default: "bg-ds-border",
  active: "bg-ds-primary",
  complete: "bg-ds-success",
  error: "bg-ds-warning",
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(({ items, className, ...props }, ref) => (
  <ol ref={ref} role="list" className={cn("relative", className)} {...props}>
    {items.map((item, idx) => {
      const status = item.status ?? "default"
      const isLast = idx === items.length - 1
      return (
        <li key={item.id} role="listitem" className="relative flex gap-4 pb-6 last:pb-0">
          {!isLast && <div className="absolute left-[11px] top-6 bottom-0 w-px border-l-2 border-ds-border" />}
          <div className="relative z-10 flex-shrink-0 flex items-start justify-center mt-0.5">
            {item.icon ? (
              <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs", dotColor[status])}>{item.icon}</span>
            ) : (
              <span className={cn("w-3 h-3 rounded-full mt-1.5 mx-1.5", dotColor[status])} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <Body className="font-medium text-ds-text">{item.title}</Body>
              {item.timestamp && <Caption className="text-ds-text-muted shrink-0">{item.timestamp}</Caption>}
            </div>
            {item.description && <Caption className="text-ds-text-muted mt-0.5">{item.description}</Caption>}
          </div>
        </li>
      )
    })}
  </ol>
))
Timeline.displayName = "Timeline"

export { Timeline }
export type { TimelineItem }
