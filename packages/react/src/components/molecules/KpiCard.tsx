import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "../utils"

type TrendDirection = 'up' | 'down' | 'neutral'

const TREND_CONFIG: Record<TrendDirection, { className: string; Icon: React.ElementType }> = {
  up:      { className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border', Icon: TrendingUp },
  down:    { className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border', Icon: TrendingDown },
  neutral: { className: 'bg-ds-surface-up text-ds-text-muted border-ds-border', Icon: Minus },
}

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: { direction: TrendDirection; label: string }
  icon?: React.ReactNode
}

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, trend, icon, className, ...props }, ref) => {
    const displayValue = typeof value === 'number' ? value.toLocaleString() : value
    return (
      <div
        ref={ref}
        className={cn('border border-ds-border rounded-xl bg-ds-surface p-6 flex flex-col gap-3', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <span className="text-sm text-ds-text-muted">{label}</span>
          {icon && <span aria-hidden="true" className="text-ds-text-muted">{icon}</span>}
        </div>
        <span className="text-2xl font-semibold text-ds-text">{displayValue}</span>
        {trend && (() => {
          const { className: trendClass, Icon } = TREND_CONFIG[trend.direction]
          return (
            <span className={cn('inline-flex items-center gap-1 self-start rounded px-1.5 py-0.5 text-xs font-medium border', trendClass)}>
              <Icon className="w-3 h-3" aria-hidden="true" />
              {trend.label}
            </span>
          )
        })()}
      </div>
    )
  }
)
KpiCard.displayName = 'KpiCard'

export { KpiCard }
