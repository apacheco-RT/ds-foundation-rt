import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "./utils"
import { H2, Caption } from "./Typography"

export interface KpiCardProps {
  label: string
  value: string | number
  trend?: { direction: "up" | "down" | "neutral"; label: string }
  icon?: React.ReactNode
  className?: string
}

function KpiCard({ label, value, trend, icon, className }: KpiCardProps) {
  const trendConfig = {
    up: { cls: "bg-green-100 text-green-300", Icon: TrendingUp },
    down: { cls: "bg-orange-100 text-orange-400", Icon: TrendingDown },
    neutral: { cls: "bg-gray-100 text-gray-400", Icon: Minus },
  }
  return (
    <div className={cn("border border-gray-100 rounded-xl shadow-sm bg-white p-6 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Caption className="text-gray-500 uppercase tracking-wide font-medium">{label}</Caption>
        {icon && <span className="text-gray-300">{icon}</span>}
      </div>
      <H2 className="text-gray-900">{typeof value === "number" ? value.toLocaleString() : value}</H2>
      {trend && (() => {
        const { cls, Icon } = trendConfig[trend.direction]
        return (
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit", cls)}>
            <Icon className="w-3 h-3" />{trend.label}
          </span>
        )
      })()}
    </div>
  )
}

export { KpiCard }
