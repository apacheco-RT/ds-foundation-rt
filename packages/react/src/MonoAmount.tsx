// @ds-component: mono-amount | @ds-version: 0.1.0
import React from 'react';

export type AmountColor = 'default' | 'success' | 'warning' | 'error' | 'muted' | 'brand';

export interface MonoAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  currency: 'USD' | 'EUR' | 'GBP';
  size?: 'sm' | 'md' | 'lg';
  color?: AmountColor;
  onProvenanceTap?: () => void;
  isLoading?: boolean;
}

const SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

const FONT_SIZE: Record<string, string> = {
  sm: 'var(--ds-font-size-xs)',
  md: 'var(--ds-font-size-sm)',
  lg: 'var(--ds-font-size-md)',
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

export const MonoAmount = React.forwardRef<HTMLSpanElement, MonoAmountProps>(
  function MonoAmount({ value, currency, size = 'md', color = 'default', onProvenanceTap, isLoading, style, ...rest }, ref) {
    // NaN / Infinity guard
    if (!isFinite(value)) {
      return (
        <span
          aria-label="invalid amount"
          ref={ref}
          {...rest}
          style={{
            fontFamily: 'var(--ds-font-family-mono)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: FONT_SIZE[size],
            color: 'var(--ds-color-text-tertiary)',
            ...style,
          }}
        >
          —
        </span>
      );
    }

    // Loading skeleton
    if (isLoading) {
      const skeletonWidths: Record<string, string> = { sm: '4rem', md: '6rem', lg: '8rem' };
      return (
        <span
          role="status"
          aria-label="Loading amount"
          ref={ref}
          {...rest}
          style={{
            display: 'inline-block',
            width: skeletonWidths[size],
            height: '1em',
            borderRadius: 'var(--ds-radius-sm)',
            backgroundColor: 'var(--ds-color-surface-raised)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
            verticalAlign: 'middle',
            ...style,
          }}
        />
      );
    }

    const interactive = !!onProvenanceTap;
    const baseStyle: React.CSSProperties = {
      fontFamily: 'var(--ds-font-family-mono)',
      fontVariantNumeric: 'tabular-nums',
      fontSize: FONT_SIZE[size],
      color: COLOR_MAP[color],
      ...(interactive
        ? { cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }
        : {}),
    };
    const mergedStyle = { ...baseStyle, ...style };

    if (!interactive) {
      return (
        <span ref={ref} {...rest} style={mergedStyle}>
          {SYMBOL[currency]}{fmt.format(value)}
        </span>
      );
    }

    return (
      <span
        role="button"
        tabIndex={0}
        aria-label={`${SYMBOL[currency]}${fmt.format(value)} ${currency} — view provenance`}
        {...rest}
        ref={ref}
        style={mergedStyle}
        onClick={onProvenanceTap}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onProvenanceTap();
          }
        }}
      >
        {SYMBOL[currency]}{fmt.format(value)}
      </span>
    );
  }
);
MonoAmount.displayName = 'MonoAmount';
