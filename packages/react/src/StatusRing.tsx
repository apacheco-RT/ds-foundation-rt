// @ds-component: status-ring | @ds-adapter: tailwind | @ds-version: 0.1.0

export type Urgency = 'critical' | 'watch' | 'clear' | 'skip';

export interface StatusRingProps {
  urgency: Urgency;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const COLOR: Record<Urgency, { dot: string; ring: string }> = {
  critical: {
    dot:  'var(--color-feedback-error-icon)',
    ring: 'color-mix(in srgb, var(--color-feedback-error-icon) 20%, transparent)',
  },
  watch: {
    dot:  'var(--color-feedback-warning-icon)',
    ring: 'color-mix(in srgb, var(--color-feedback-warning-icon) 20%, transparent)',
  },
  clear: {
    dot:  'var(--color-feedback-success-icon)',
    ring: 'color-mix(in srgb, var(--color-feedback-success-icon) 20%, transparent)',
  },
  skip: {
    dot:  'var(--color-brand-secondary)',
    ring: 'color-mix(in srgb, var(--color-brand-secondary) 20%, transparent)',
  },
};

export function StatusRing({ urgency, size = 'md', pulse = false }: StatusRingProps) {
  const px = size === 'sm' ? 8 : 10;
  const { dot, ring } = COLOR[urgency];
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        borderRadius: '9999px',
        backgroundColor: dot,
        boxShadow: `0 0 0 3px ${ring}`,
        flexShrink: 0,
        ...(pulse
          ? { animation: 'pulse-ring var(--motion-deliberate) ease-in-out infinite' }
          : {}),
      }}
    />
  );
}
