import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "../utils"

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonColorScheme = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'

const ICON_DIMENSION: Record<ButtonSize, string> = {
  xs: '14px', sm: '14px', md: '16px', lg: '16px', xl: '16px', icon: '16px',
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium ' +
  'transition-colors duration-ds-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'aria-busy:pointer-events-none',
  {
    variants: {
      size: {
        xs:   'h-7 px-2.5 text-[length:var(--ds-font-size-xs)]',
        sm:   'h-8 px-3 text-[length:var(--ds-font-size-sm)]',
        md:   'h-10 px-4 text-[length:var(--ds-font-size-sm)]',
        lg:   'h-11 px-6 text-[length:var(--ds-font-size-md)]',
        xl:   'h-12 px-8 text-[length:var(--ds-font-size-md)]',
        icon: 'h-10 w-10 p-0',
      },
      variant:     { solid: '', outline: '', ghost: '', link: 'underline-offset-4 hover:underline' },
      colorScheme: { primary: '', success: '', warning: '', danger: '', neutral: '' },
    },
    compoundVariants: [
      // ── Solid ────────────────────────────────────────────────────────────
      { variant: 'solid', colorScheme: 'primary',
        className: 'bg-ds-primary text-ds-primary-fg border-transparent hover:bg-ds-primary-hover active:bg-ds-primary-active' },
      { variant: 'solid', colorScheme: 'success',
        className: 'bg-ds-success text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75' },
      { variant: 'solid', colorScheme: 'warning',
        className: 'bg-ds-warning text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75' },
      { variant: 'solid', colorScheme: 'danger',
        className: 'bg-ds-danger text-ds-text-inverse border-transparent hover:opacity-90 active:opacity-75' },
      { variant: 'solid', colorScheme: 'neutral',
        className: 'bg-ds-surface-up text-ds-text border-ds-border hover:bg-ds-surface hover:border-ds-border-strong active:bg-ds-sunken' },
      // ── Outline ──────────────────────────────────────────────────────────
      { variant: 'outline', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-ds-primary hover:bg-ds-primary-subtle active:bg-ds-primary-subtle' },
      { variant: 'outline', colorScheme: 'success',
        className: 'bg-transparent text-ds-success-text border-ds-success-border hover:bg-ds-feedback-success-bg active:bg-ds-feedback-success-bg' },
      { variant: 'outline', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning-text border-ds-warning-border hover:bg-ds-feedback-warning-bg active:bg-ds-feedback-warning-bg' },
      { variant: 'outline', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger-text border-ds-danger-border hover:bg-ds-feedback-error-bg active:bg-ds-feedback-error-bg' },
      { variant: 'outline', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-ds-border hover:bg-ds-surface-up active:bg-ds-sunken' },
      // ── Ghost ────────────────────────────────────────────────────────────
      { variant: 'ghost', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-transparent hover:bg-ds-primary-subtle active:bg-ds-primary-subtle' },
      { variant: 'ghost', colorScheme: 'success',
        className: 'bg-transparent text-ds-success border-transparent hover:bg-ds-feedback-success-bg active:bg-ds-feedback-success-bg' },
      { variant: 'ghost', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning border-transparent hover:bg-ds-feedback-warning-bg active:bg-ds-feedback-warning-bg' },
      { variant: 'ghost', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger border-transparent hover:bg-ds-feedback-error-bg active:bg-ds-feedback-error-bg' },
      { variant: 'ghost', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-transparent hover:bg-ds-surface-up active:bg-ds-sunken' },
      // ── Link ─────────────────────────────────────────────────────────────
      { variant: 'link', colorScheme: 'primary',
        className: 'bg-transparent text-ds-primary border-transparent hover:text-ds-primary-hover' },
      { variant: 'link', colorScheme: 'neutral',
        className: 'bg-transparent text-ds-text border-transparent hover:text-ds-text-muted' },
      { variant: 'link', colorScheme: 'danger',
        className: 'bg-transparent text-ds-danger border-transparent' },
      { variant: 'link', colorScheme: 'success',
        className: 'bg-transparent text-ds-success border-transparent' },
      { variant: 'link', colorScheme: 'warning',
        className: 'bg-transparent text-ds-warning border-transparent' },
    ],
    defaultVariants: { variant: 'solid', colorScheme: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  colorScheme?: ButtonColorScheme
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      colorScheme = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const iconDim = ICON_DIMENSION[size]

    const wrapIcon = (icon: React.ReactElement) => (
      <span
        className="shrink-0 [&>svg]:w-full [&>svg]:h-full"
        style={{ width: iconDim, height: iconDim }}
        aria-hidden="true"
      >
        {icon}
      </span>
    )

    const leftSlot = isLoading
      ? wrapIcon(<Loader2 className="animate-spin" />)
      : leftIcon
        ? wrapIcon(leftIcon)
        : null

    const rightSlot = !isLoading && rightIcon ? wrapIcon(rightIcon) : null

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, colorScheme, size }), className)}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {leftSlot}
        {isLoading && loadingText ? loadingText : children}
        {rightSlot}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonVariant, ButtonColorScheme, ButtonSize }
