// @ds-component: freshness-chip | @ds-adapter: tailwind | @ds-version: 0.1.0

export type FreshnessState = 'fresh' | 'watch' | 'stale';

export interface FreshnessChipProps {
  state: FreshnessState;
  timestamp: Date;
  onRefresh?: () => void;
}

/** Thresholds for freshness state derivation (ms) */
const FRESHNESS_WATCH_MS = 5 * 60 * 1000;   // 5 minutes
const FRESHNESS_STALE_MS = 15 * 60 * 1000;  // 15 minutes

/** Format a Date as a relative time string (e.g. "3 min ago") */
function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export function FreshnessChip({ state, timestamp, onRefresh }: FreshnessChipProps) {
  if (state === 'fresh') return <span aria-live="polite" style={{ display: 'none' }} />;

  const isStale = state === 'stale';
  const bg     = isStale ? 'var(--color-feedback-error-bg)'     : 'var(--color-feedback-warning-bg)';
  const text   = isStale ? 'var(--color-feedback-error-text)'   : 'var(--color-feedback-warning-text)';
  const border = isStale ? 'var(--color-feedback-error-border)' : 'var(--color-feedback-warning-border)';
  const label  = isStale ? 'Stale' : 'Watch';

  return (
    <span aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: bg,
          color: text,
          border: `1px solid ${border}`,
          fontSize: 'var(--font-size-2xs)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          lineHeight: 1.4,
        }}
      >
        {label} · {formatRelativeTime(timestamp.toISOString())}
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
            fontSize: 'var(--font-size-xs)',
          }}
        >
          ↺
        </button>
      )}
    </span>
  );
}

/** Derive FreshnessState from a timestamp */
export function deriveFreshnessState(lastUpdatedAt: Date): FreshnessState {
  const age = Date.now() - lastUpdatedAt.getTime();
  if (age >= FRESHNESS_STALE_MS) return 'stale';
  if (age >= FRESHNESS_WATCH_MS) return 'watch';
  return 'fresh';
}
