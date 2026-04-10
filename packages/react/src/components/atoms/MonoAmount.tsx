import * as React from "react"
import { cn } from "../utils"

type AmountColor = 'default' | 'success' | 'warning' | 'error' | 'muted' | 'brand'
type AmountSize = 'sm' | 'md' | 'lg'
type AmountCurrency = 'USD' | 'EUR' | 'GBP'

const COLOR_CLASS: Record<AmountColor, string> = {
  default: 'text-ds-text',
  success: 'text-ds-success',
  warning: 'text-ds-warning',
  error:   'text-ds-danger',
  muted:   'text-ds-text-muted',
  brand:   'text-ds-primary',
}

const SIZE_CLASS: Record<AmountSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const CURRENCY_SYMBOL: Record<AmountCurrency, string> = { USD: '$', EUR: '€', GBP: '£' }

function formatAmount(value: number, currency: AmountCurrency): string {
  return `${CURRENCY_SYMBOL[currency]}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export interface MonoAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  currency: AmountCurrency
  size?: AmountSize
  color?: AmountColor
  onProvenanceTap?: () => void
}

const MonoAmount = React.forwardRef<HTMLSpanElement, MonoAmountProps>(
  ({ value, currency, size = 'md', color = 'default', onProvenanceTap, className, ...props }, ref) => {
    const interactive = !!onProvenanceTap
    const formatted = formatAmount(value, currency)

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onProvenanceTap!()
      }
    }

    return (
      <span
        ref={ref}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `${formatted} — view provenance` : undefined}
        onClick={interactive ? onProvenanceTap : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        className={cn(
          'font-mono tabular-nums',
          SIZE_CLASS[size],
          COLOR_CLASS[color],
          interactive && 'cursor-pointer underline underline-offset-2',
          className
        )}
        {...props}
      >
        {formatted}
      </span>
    )
  }
)
MonoAmount.displayName = 'MonoAmount'

export type FreshnessState = 'fresh' | 'watch' | 'stale'

export function deriveFreshnessState(lastUpdatedAt: Date): FreshnessState {
  const ageMs = Date.now() - lastUpdatedAt.getTime()
  if (ageMs >= 15 * 60 * 1000) return 'stale'
  if (ageMs >= 5 * 60 * 1000) return 'watch'
  return 'fresh'
}

export { MonoAmount, type AmountColor, type AmountCurrency }
