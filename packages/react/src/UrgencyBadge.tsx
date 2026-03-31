// @ds-component: urgency-badge | @ds-adapter: tailwind | @ds-version: 0.1.0
import type { Urgency } from './StatusRing';

export type { Urgency };

export interface UrgencyBadgeProps {
  urgency: Urgency;
  label?: string;
}

const DEFAULT_LABEL: Record<Urgency, string> = {
  critical: 'Critical',
  watch:    'Watch',
  clear:    'Clear',
  skip:     'Skip-node',
};

const STYLE: Record<Urgency, { bg: string; text: string; border: string }> = {
  critical: {
    bg:     'var(--color-feedback-error-bg)',
    text:   'var(--color-feedback-error-text)',
    border: 'var(--color-feedback-error-border)',
  },
  watch: {
    bg:     'var(--color-feedback-warning-bg)',
    text:   'var(--color-feedback-warning-text)',
    border: 'var(--color-feedback-warning-border)',
  },
  clear: {
    bg:     'var(--color-feedback-success-bg)',
    text:   'var(--color-feedback-success-text)',
    border: 'var(--color-feedback-success-border)',
  },
  skip: {
    bg:     'color-mix(in srgb, var(--color-brand-secondary) 8%, transparent)',
    text:   'var(--color-brand-secondary)',
    border: 'color-mix(in srgb, var(--color-brand-secondary) 30%, transparent)',
  },
};

export function UrgencyBadge({ urgency, label }: UrgencyBadgeProps) {
  const s = STYLE[urgency];
  const displayLabel = label ?? DEFAULT_LABEL[urgency];
  return (
    <span
      aria-label={`Urgency: ${displayLabel}`}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontSize: 'var(--font-size-2xs)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        lineHeight: 1.4,
      }}
    >
      {displayLabel}
    </span>
  );
}
