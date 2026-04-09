// @ds-component: currency-badge | @ds-version: 0.1.0
import * as React from 'react';

export interface CurrencyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: 'USD' | 'EUR' | 'GBP';
}

export function CurrencyBadge({ currency, style, ...rest }: CurrencyBadgeProps) {
  const internalStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 'var(--ds-radius-full)',
    backgroundColor: 'var(--ds-color-surface-sunken)',
    color: 'var(--ds-color-text-secondary)',
    border: '1px solid var(--ds-color-border-default)',
    fontFamily: 'var(--ds-font-family-mono)',
    fontSize: 'var(--ds-font-size-2xs)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    lineHeight: 1.4,
  };
  return (
    <span aria-label={`Currency: ${currency}`} {...rest} style={{ ...internalStyle, ...style }}>
      {currency}
    </span>
  );
}
