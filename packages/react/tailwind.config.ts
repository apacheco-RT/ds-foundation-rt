// packages/react/tailwind.config.ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

export default {
  // Dark mode fires on [data-theme="dark"] attribute on <html>.
  // This keeps the `dark:` Tailwind variant working without a class toggle.
  darkMode: ['selector', '[data-theme="dark"]'],
  content: {
    // Resolve globs relative to this config file, not process.cwd().
    // Required when PostCSS is invoked from a different CWD.
    relative: true,
    files: ['./src/**/*.{ts,tsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      // ring-offset uses ringOffsetColor, not colors
      ringOffsetColor: {
        'ds-surface': 'var(--ds-surface)',
        'ds-bg':      'var(--ds-bg)',
      },
      colors: {
        ds: {
          bg:               'var(--ds-bg)',
          surface:          'var(--ds-surface)',
          'surface-up':     'var(--ds-surface-up)',
          overlay:          'var(--ds-overlay)',
          sunken:           'var(--ds-sunken)',
          text:             'var(--ds-text)',
          'text-muted':     'var(--ds-text-muted)',
          'text-disabled':  'var(--ds-text-disabled)',
          'text-inverse':   'var(--ds-text-inverse)',
          border:           'var(--ds-border)',
          'border-strong':  'var(--ds-border-strong)',
          'border-focus':   'var(--ds-border-focus)',
          primary:          'var(--ds-primary)',
          'primary-hover':  'var(--ds-primary-hover)',
          'primary-fg':     'var(--ds-primary-fg)',
          'primary-subtle': 'var(--ds-primary-subtle)',
          success:          'var(--ds-success)',
          warning:          'var(--ds-warning)',
          danger:           'var(--ds-danger)',
          info:             'var(--ds-info)',

          // Interactive states
          interactive:                 'var(--ds-interactive)',
          'interactive-hover':         'var(--ds-interactive-hover)',
          'interactive-active':        'var(--ds-interactive-active)',
          'interactive-disabled':      'var(--ds-interactive-disabled)',
          'interactive-selected':      'var(--ds-interactive-selected)',
          'interactive-selected-bg':   'var(--ds-interactive-selected-bg)',

          // Primary active
          'primary-active':             'var(--ds-primary-active)',

          // Focus ring
          'focus-ring':                 'var(--ds-focus-ring-color)',

          // Feedback text + border (for outline/ghost buttons)
          'success-text':               'var(--ds-success-text)',
          'success-border':             'var(--ds-success-border)',
          'warning-text':               'var(--ds-warning-text)',
          'warning-border':             'var(--ds-warning-border)',
          'danger-text':                'var(--ds-danger-text)',
          'danger-border':              'var(--ds-danger-border)',
          'info-text':                  'var(--ds-info-text)',
          'info-border':                'var(--ds-info-border)',

          // Feedback backgrounds (for hover fills on outline/ghost buttons)
          'feedback-success-bg':        'var(--ds-feedback-success-bg)',
          'feedback-error-bg':          'var(--ds-feedback-error-bg)',
          'feedback-warning-bg':        'var(--ds-feedback-warning-bg)',
          'feedback-info-bg':           'var(--ds-feedback-info-bg)',
        },
      },
      boxShadow: {
        'ds-xs':  'var(--ds-shadow-xs)',
        'ds-sm':  'var(--ds-shadow-sm)',
        'ds-md':  'var(--ds-shadow-md)',
        'ds-lg':  'var(--ds-shadow-lg)',
        'ds-xl':  'var(--ds-shadow-xl)',
        'ds-2xl': 'var(--ds-shadow-2xl)',
      },
      transitionDuration: {
        'ds-fast':   '150ms',
        'ds-normal': '200ms',
        'ds-slow':   '300ms',
      },
      transitionTimingFunction: {
        'ds-default': 'var(--ds-ease-default)',
        'ds-in':      'var(--ds-ease-in)',
        'ds-out':     'var(--ds-ease-out)',
        'ds-in-out':  'var(--ds-ease-in-out)',
        'ds-spring':  'var(--ds-ease-spring)',
      },
      borderRadius: {
        lg: 'var(--ds-radius-lg)',
        md: 'var(--ds-radius-md)',
        sm: 'var(--ds-radius-sm)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    animate,
    plugin(function ({ addVariant }) {
      addVariant('sketch', '[data-theme="wireframe"] &')
      addVariant('hifi', ':not([data-theme="wireframe"]) &')
    }),
  ],
} satisfies Config;
