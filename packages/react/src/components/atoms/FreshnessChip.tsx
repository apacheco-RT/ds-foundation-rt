import * as React from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "../utils"
import { type FreshnessState } from "./MonoAmount"

function formatRelativeTime(date: Date): string {
  const mins = Math.round((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} mins ago`
}

export interface FreshnessChipProps extends React.HTMLAttributes<HTMLDivElement> {
  state: FreshnessState
  timestamp: Date
  onRefresh?: () => void
}

const FreshnessChip = React.forwardRef<HTMLDivElement, FreshnessChipProps>(
  ({ state, timestamp, onRefresh, className, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
      <span
        role="status"
        aria-live="polite"
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tracking-widest border',
          state === 'fresh' && 'hidden',
          state === 'watch' && 'bg-ds-feedback-warning-bg text-ds-warning-text border-ds-warning-border',
          state === 'stale' && 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border'
        )}
      >
        {state !== 'fresh' && formatRelativeTime(timestamp)}
      </span>
      {state === 'stale' && onRefresh && (
        <button
          type="button"
          aria-label="Refresh data"
          onClick={onRefresh}
          className="text-ds-danger hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-border-focus rounded"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  )
)
FreshnessChip.displayName = 'FreshnessChip'

export { FreshnessChip }
