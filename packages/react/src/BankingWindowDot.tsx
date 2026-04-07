// @ds-component: banking-window-dot | @ds-version: 0.1.0
import React from 'react';
import { useReducedMotion } from './utils/useReducedMotion';

export type WindowStatus = 'open' | 'closing' | 'closed';

export interface BankingWindowDotProps {
  status: WindowStatus;
  size?: number;
}

const DOT_COLOR: Record<WindowStatus, string> = {
  open:    'var(--ds-color-feedback-success-icon)',
  closing: 'var(--ds-color-feedback-warning-icon)',
  closed:  'var(--ds-color-text-tertiary)',
};

export function BankingWindowDot({ status, size = 6 }: BankingWindowDotProps) {
  const reducedMotion = useReducedMotion();
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
        ...(status === 'closing' && !reducedMotion
          ? { animation: 'pulse-ring var(--ds-motion-duration-deliberate) ease-in-out infinite' }
          : {}),
      }}
    />
  );
}
