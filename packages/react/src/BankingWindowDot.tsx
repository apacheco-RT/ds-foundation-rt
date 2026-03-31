// @ds-component: banking-window-dot | @ds-adapter: tailwind | @ds-version: 0.1.0

export type WindowStatus = 'open' | 'closing' | 'closed';

export interface BankingWindowDotProps {
  status: WindowStatus;
  size?: number;
}

const DOT_COLOR: Record<WindowStatus, string> = {
  open:    'var(--color-feedback-success-icon)',
  closing: 'var(--color-feedback-warning-icon)',
  closed:  'var(--color-text-tertiary)',
};

export function BankingWindowDot({ status, size = 6 }: BankingWindowDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: DOT_COLOR[status],
        flexShrink: 0,
        ...(status === 'closing'
          ? { animation: 'pulse-ring var(--motion-deliberate) ease-in-out infinite' }
          : {}),
      }}
    />
  );
}
