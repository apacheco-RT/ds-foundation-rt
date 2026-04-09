// @ds-component: state-badge | @ds-version: 0.2.0
import * as React from 'react';

export type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type StateBadgeSize = 'sm' | 'md';

export interface StateBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: string;
  intent: StateBadgeIntent;
  nextState?: string;
  size?: StateBadgeSize;
}

const INTENT_STYLE: Record<StateBadgeIntent, { bg: string; border: string; color: string }> = {
  info:    { bg: 'var(--ds-color-feedback-info-bg)',    border: 'var(--ds-color-feedback-info-border)',    color: 'var(--ds-color-feedback-info-text)' },
  warning: { bg: 'var(--ds-color-feedback-warning-bg)', border: 'var(--ds-color-feedback-warning-border)', color: 'var(--ds-color-feedback-warning-text)' },
  success: { bg: 'var(--ds-color-feedback-success-bg)', border: 'var(--ds-color-feedback-success-border)', color: 'var(--ds-color-feedback-success-text)' },
  error:   { bg: 'var(--ds-color-feedback-error-bg)',   border: 'var(--ds-color-feedback-error-border)',   color: 'var(--ds-color-feedback-error-text)' },
  neutral: { bg: 'var(--ds-color-surface-sunken)',      border: 'var(--ds-color-border-default)',          color: 'var(--ds-color-text-secondary)' },
};

const SIZE_STYLE: Record<StateBadgeSize, { padding: string; fontSize: string }> = {
  sm: { padding: '2px 6px', fontSize: 'var(--ds-font-size-xs)' },
  md: { padding: '3px 8px', fontSize: 'var(--ds-font-size-sm)' },
};

export const StateBadge = React.forwardRef<HTMLSpanElement, StateBadgeProps>(
  function StateBadge({ state, intent, nextState, size = 'md', style, ...rest }, ref) {
    const s = INTENT_STYLE[intent];
    const sz = SIZE_STYLE[size];
    const ariaLabel = nextState
      ? `Status: ${state}, next: ${nextState}`
      : `Status: ${state}`;
    const internalStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: sz.padding,
      borderRadius: 'var(--ds-radius-lg)',
      backgroundColor: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
      fontSize: sz.fontSize,
      fontWeight: 'var(--ds-font-weight-medium)',
      letterSpacing: 'var(--ds-font-tracking-wide)',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    };

    return (
      <span
        role="status"
        aria-label={ariaLabel}
        {...rest}
        ref={ref}
        style={{ ...internalStyle, ...style }}
      >
        {state}
        {nextState && (
          <>
            <span
              aria-hidden="true"
              style={{ color: 'var(--ds-color-text-tertiary)', fontWeight: 'normal' }}
            >
              →
            </span>
            <span style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>{nextState}</span>
          </>
        )}
      </span>
    );
  }
);
StateBadge.displayName = 'StateBadge';
