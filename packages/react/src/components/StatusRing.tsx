// @ds-component: status-ring | @ds-version: 0.1.0
import React from 'react';
import { useReducedMotion } from './utils/useReducedMotion';

export type Urgency = 'critical' | 'watch' | 'clear' | 'skip';

export interface StatusRingProps extends React.HTMLAttributes<HTMLSpanElement> {
  urgency: Urgency;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const COLOR: Record<Urgency, { dot: string; ring: string }> = {
  critical: {
    dot:  'var(--ds-color-feedback-error-icon)',
    ring: 'color-mix(in srgb, var(--ds-color-feedback-error-icon) 20%, transparent)',
  },
  watch: {
    dot:  'var(--ds-color-feedback-warning-icon)',
    ring: 'color-mix(in srgb, var(--ds-color-feedback-warning-icon) 20%, transparent)',
  },
  clear: {
    dot:  'var(--ds-color-feedback-success-icon)',
    ring: 'color-mix(in srgb, var(--ds-color-feedback-success-icon) 20%, transparent)',
  },
  skip: {
    dot:  'var(--ds-color-brand-secondary)',
    ring: 'color-mix(in srgb, var(--ds-color-brand-secondary) 20%, transparent)',
  },
};

export function StatusRing({ urgency, size = 'md', pulse = false, style, ...rest }: StatusRingProps) {
  const reducedMotion = useReducedMotion();
  const px = size === 'sm' ? 8 : 10;
  const { dot, ring } = COLOR[urgency];
  const internalStyle: React.CSSProperties = {
    display: 'inline-block',
    width: px,
    height: px,
    borderRadius: '9999px',
    backgroundColor: dot,
    boxShadow: `0 0 0 3px ${ring}`,
    flexShrink: 0,
    ...(pulse && !reducedMotion
      ? { animation: 'pulse-ring var(--ds-motion-duration-deliberate) ease-in-out infinite' }
      : {}),
  };
  return <span aria-hidden="true" {...rest} style={{ ...internalStyle, ...style }} />;
}
