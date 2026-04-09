// @ds-component: detail-card | @ds-version: 0.2.0
import React from 'react';

const BORDER_MUTED = '1px solid color-mix(in srgb, var(--ds-color-border-default) 50%, transparent)';

export interface DetailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export const DetailCard = React.forwardRef<HTMLDivElement, DetailCardProps>(
  function DetailCard({ title, children, isLoading, style, ...rest }, ref) {
    const outerStyle: React.CSSProperties = {
      borderRadius: 'var(--ds-radius-lg)',
      backgroundColor: 'var(--ds-color-surface-default)',
      border: BORDER_MUTED,
      padding: 'var(--ds-layout-card-padding)',
    };

    if (isLoading) {
      return (
        <div
          {...rest}
          ref={ref}
          aria-busy="true"
          aria-label="Loading"
          style={{ ...outerStyle, ...style }}
        >
          {/* Title skeleton */}
          <div style={{
            height: 'var(--ds-font-size-xs)',
            width: '40%',
            borderRadius: 'var(--ds-radius-sm)',
            backgroundColor: 'var(--ds-color-surface-raised)',
            marginBottom: 'var(--ds-spacing-3)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }} />
          {/* Content skeletons */}
          <div style={{
            height: 'var(--ds-spacing-4)',
            width: '100%',
            borderRadius: 'var(--ds-radius-sm)',
            backgroundColor: 'var(--ds-color-surface-raised)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }} />
          <div style={{
            height: 'var(--ds-spacing-4)',
            width: '75%',
            borderRadius: 'var(--ds-radius-sm)',
            backgroundColor: 'var(--ds-color-surface-raised)',
            marginTop: 'var(--ds-spacing-2)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      );
    }

    return (
      <div {...rest} ref={ref} style={{ ...outerStyle, ...style }}>
        <h4
          style={{
            fontSize: 'var(--ds-font-size-xs)',
            fontWeight: 'var(--ds-font-weight-medium)',
            color: 'var(--ds-color-brand-primary)',
            letterSpacing: 'var(--ds-font-tracking-wide)',
            textTransform: 'uppercase',
            paddingBottom: 'var(--ds-spacing-2)',
            borderBottom: BORDER_MUTED,
            margin: '0 0 var(--ds-spacing-3) 0',
          }}
        >
          {title}
        </h4>
        {children}
      </div>
    );
  }
);
DetailCard.displayName = 'DetailCard';
