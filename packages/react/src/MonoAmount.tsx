// @ds-component: mono-amount | @ds-adapter: tailwind | @ds-version: 0.1.0
import React from 'react';

export type AmountColor = 'default' | 'success' | 'warning' | 'error' | 'muted' | 'brand';

export interface MonoAmountProps {
  value: number;
  currency: 'USD' | 'EUR' | 'GBP';
  size?: 'sm' | 'md' | 'lg';
  color?: AmountColor;
  onProvenanceTap?: () => void;
}

const SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

const FONT_SIZE: Record<string, string> = {
  sm: 'var(--font-size-xs)',
  md: 'var(--font-size-sm)',
  lg: 'var(--font-size-md)',
};

const COLOR_MAP: Record<AmountColor, string> = {
  default: 'var(--ds-color-text-primary)',
  success: 'var(--ds-color-feedback-success-icon)',
  warning: 'var(--ds-color-feedback-warning-text)',
  error:   'var(--ds-color-feedback-error-icon)',
  muted:   'var(--ds-color-text-tertiary)',
  brand:   'var(--ds-color-brand-primary)',
};

const fmt = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function MonoAmount({
  value,
  currency,
  size = 'md',
  color = 'default',
  onProvenanceTap,
}: MonoAmountProps) {
  const interactive = !!onProvenanceTap;
  const style: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: FONT_SIZE[size],
    color: COLOR_MAP[color],
    ...(interactive
      ? { cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }
      : {}),
  };

  if (!interactive) {
    return (
      <span style={style}>
        {SYMBOL[currency]}
        {fmt.format(value)}
      </span>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`${SYMBOL[currency]}${fmt.format(value)} ${currency} — view provenance`}
      style={style}
      onClick={onProvenanceTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProvenanceTap();
        }
      }}
    >
      {SYMBOL[currency]}
      {fmt.format(value)}
    </span>
  );
}
