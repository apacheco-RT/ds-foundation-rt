// @ds-component: currency-badge | @ds-adapter: tailwind | @ds-version: 0.1.0

export interface CurrencyBadgeProps {
  currency: 'USD' | 'EUR' | 'GBP';
}

export function CurrencyBadge({ currency }: CurrencyBadgeProps) {
  return (
    <span
      aria-label={`Currency: ${currency}`}
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-surface-sunken)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border-default)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--font-size-2xs)',
        fontWeight: 700,
        letterSpacing: '0.05em',
        lineHeight: 1.4,
      }}
    >
      {currency}
    </span>
  );
}
