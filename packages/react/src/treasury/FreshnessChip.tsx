// @ds-component: freshness-chip | @ds-version: 0.1.0
import * as React from 'react';

export type FreshnessState = 'fresh' | 'watch' | 'stale';

export interface FreshnessChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: FreshnessState;
  timestamp: Date;
  onRefresh?: () => void;
}

/** Thresholds for freshness state derivation (ms) */
export const FRESHNESS_WATCH_MS = 5 * 60 * 1000;   // 5 minutes
export const FRESHNESS_STALE_MS = 15 * 60 * 1000;  // 15 minutes

/** Format a Date as a relative time string (e.g. "3 min ago") */
function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export function FreshnessChip({ state, timestamp, onRefresh, style, ...rest }: FreshnessChipProps) {
  if (state === 'fresh') {
    return <span aria-live="polite" {...rest} style={{ display: 'none', ...style }} />;
  }

  const isStale = state === 'stale';
  const bg     = isStale ? 'var(--ds-color-feedback-error-bg)'     : 'var(--ds-color-feedback-warning-bg)';
  const text   = isStale ? 'var(--ds-color-feedback-error-text)'   : 'var(--ds-color-feedback-warning-text)';
  const border = isStale ? 'var(--ds-color-feedback-error-border)' : 'var(--ds-color-feedback-warning-border)';
  const label  = isStale ? 'Stale' : 'Watch';

  return (
    <span aria-live="polite" {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...style }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 'var(--ds-radius-full)',
          backgroundColor: bg,
          color: text,
          border: `1px solid ${border}`,
          fontSize: 'var(--ds-font-size-2xs)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          lineHeight: 1.4,
        }}
      >
        {label} · {formatRelativeTime(timestamp)}
      </span>
      {isStale && onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh data"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: text,
            padding: '0 2px',
            fontSize: 'var(--ds-font-size-xs)',
          }}
        >
          ↺
        </button>
      )}
    </span>
  );
}

/** Derive FreshnessState from a timestamp */
export function deriveFreshnessState(
  lastUpdatedAt: Date,
  options?: { watchThresholdMs?: number; staleThresholdMs?: number }
): FreshnessState {
  const watchMs = options?.watchThresholdMs ?? FRESHNESS_WATCH_MS;
  const staleMs = options?.staleThresholdMs ?? FRESHNESS_STALE_MS;
  const age = Date.now() - lastUpdatedAt.getTime();
  if (age >= staleMs) return 'stale';
  if (age >= watchMs) return 'watch';
  return 'fresh';
}
