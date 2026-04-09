import * as React from "react"
import { cn } from "./utils"
import { Caption, Body } from "./Typography"

type TimelineStatus = "default" | "active" | "complete" | "error"

interface TimelineItem {
  id: string
  icon?: React.ReactNode
  title: string
  description?: string
  timestamp?: string
  status?: TimelineStatus
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const dotColor: Record<TimelineStatus, string> = {
  default: "bg-gray-300",
  active: "bg-blue-500",
  complete: "bg-green-300",
  error: "bg-orange-400",
}

function Timeline({ items, className }: TimelineProps) {
  return (
    <ol role="list" className={cn("relative", className)}>
      {items.map((item, idx) => {
        const status = item.status ?? "default"
        const isLast = idx === items.length - 1
        return (
          <li key={item.id} role="listitem" className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <div className="absolute left-[11px] top-6 bottom-0 w-px border-l-2 border-gray-100" />}
            <div className="relative z-10 flex-shrink-0 flex items-start justify-center mt-0.5">
              {item.icon ? (
                <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs", dotColor[status])}>{item.icon}</span>
              ) : (
                <span className={cn("w-3 h-3 rounded-full mt-1.5 mx-1.5", dotColor[status])} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <Body className="font-medium text-gray-900">{item.title}</Body>
                {item.timestamp && <Caption className="text-gray-400 shrink-0">{item.timestamp}</Caption>}
              </div>
              {item.description && <Caption className="text-gray-500 mt-0.5">{item.description}</Caption>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { Timeline }
export type { TimelineItem }
