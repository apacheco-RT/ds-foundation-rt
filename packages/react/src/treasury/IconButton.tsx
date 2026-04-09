// @ds-component: icon-button | @ds-version: 0.2.0
import * as React from 'react';

export type IconButtonVariant = 'info' | 'success' | 'primary' | 'warning' | 'danger' | 'neutral';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const VARIANT_HOVER: Record<IconButtonVariant, { color: string; bg: string; ring: string }> = {
  info:    { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',    ring: 'var(--ds-color-feedback-info-border)' },
  success: { color: 'var(--ds-color-feedback-success-text)', bg: 'var(--ds-color-feedback-success-bg)', ring: 'var(--ds-color-feedback-success-border)' },
  primary: { color: 'var(--ds-color-brand-primary)',         bg: 'var(--ds-color-brand-primary-subtle)', ring: 'var(--ds-color-brand-primary)' },
  warning: { color: 'var(--ds-color-feedback-warning-text)', bg: 'var(--ds-color-feedback-warning-bg)', ring: 'var(--ds-color-feedback-warning-border)' },
  danger:  { color: 'var(--ds-color-feedback-error-text)',   bg: 'var(--ds-color-feedback-error-bg)',   ring: 'var(--ds-color-feedback-error-border)' },
  neutral: { color: 'var(--ds-color-text-ds-primary)',          bg: 'var(--ds-color-surface-raised)',       ring: 'var(--ds-color-brand-primary)' },
};

const SIZE_STYLE: Record<IconButtonSize, { iconOnly: React.CSSProperties; withText: React.CSSProperties }> = {
  sm: {
    iconOnly: { padding: '4px', minWidth: '24px', minHeight: '24px' },
    withText: { padding: '4px 8px', minHeight: '24px', gap: '4px', fontSize: 'var(--ds-font-size-xs)' },
  },
  md: {
    iconOnly: { padding: '6px', minWidth: '28px', minHeight: '28px' },
    withText: { padding: '6px 12px', minHeight: '28px', gap: '6px' },
  },
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ variant = 'neutral', size = 'md', icon, children, style, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest }, ref) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const v = VARIANT_HOVER[variant];
    const sizeStyle = children ? SIZE_STYLE[size].withText : SIZE_STYLE[size].iconOnly;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--ds-radius-lg)',
      border: 'none',
      cursor: rest.disabled ? 'not-allowed' : 'pointer',
      opacity: rest.disabled ? 0.3 : 1,
      transition: 'color 0.15s ease, background-color 0.15s ease',
      color: isHovered ? v.color : 'var(--ds-color-text-secondary)',
      backgroundColor: isHovered ? v.bg : 'transparent',
      outline: isFocused ? `2px solid ${v.ring}` : 'none',
      outlineOffset: '2px',
      ...sizeStyle,
      ...style,
    };

    return (
      <button
        type="button"
        ref={ref}
        style={baseStyle}
        onMouseEnter={(e) => { if (!rest.disabled) setIsHovered(true); onMouseEnter?.(e); }}
        onMouseLeave={(e) => { if (!rest.disabled) setIsHovered(false); onMouseLeave?.(e); }}
        onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
