// @ds-component: detail-card | @ds-adapter: tailwind | @ds-version: 0.2.0

const BORDER_MUTED = '1px solid color-mix(in srgb, var(--ds-color-border-default) 50%, transparent)';

export interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--ds-radius-lg)',
        backgroundColor: 'var(--ds-color-surface-default)',
        border: BORDER_MUTED,
        padding: '16px',
      }}
    >
      <h4
        style={{
          fontSize: 'var(--ds-font-size-xs)',
          fontWeight: 'var(--ds-font-weight-medium)',
          color: 'var(--ds-color-brand-primary)',
          letterSpacing: 'var(--ds-font-tracking-wide)',
          textTransform: 'uppercase',
          paddingBottom: '8px',
          borderBottom: BORDER_MUTED,
          margin: '0 0 12px 0',
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}
