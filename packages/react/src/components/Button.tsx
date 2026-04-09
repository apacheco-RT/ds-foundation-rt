import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "./utils"

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonColorScheme = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'

const SOLID_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--ds-primary)', color: 'var(--ds-primary-fg)' },
  success: { backgroundColor: 'var(--ds-feedback-success-icon)', color: 'var(--ds-text-inverse)' },
  warning: { backgroundColor: 'var(--ds-feedback-warning-icon)', color: 'var(--ds-text-inverse)' },
  danger:  { backgroundColor: 'var(--ds-feedback-error-icon)', color: 'var(--ds-text-inverse)' },
  neutral: { backgroundColor: 'var(--ds-surface-up)', color: 'var(--ds-text)' },
}

const OUTLINE_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'transparent', borderColor: 'var(--ds-primary)', color: 'var(--ds-primary)' },
  success: { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-success-border)', color: 'var(--ds-feedback-success-text)' },
  warning: { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-warning-border)', color: 'var(--ds-feedback-warning-text)' },
  danger:  { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-error-border)', color: 'var(--ds-feedback-error-text)' },
  neutral: { backgroundColor: 'transparent', borderColor: 'var(--ds-border)', color: 'var(--ds-text)' },
}

const GHOST_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-primary)' },
  success: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-success-text)' },
  warning: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-warning-text)' },
  danger:  { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-error-text)' },
  neutral: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-text)' },
}

const LINK_STYLE: React.CSSProperties = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  color: 'var(--ds-primary)',
}

const ICON_DIMENSION: Record<ButtonSize, string> = {
  xs: '14px', sm: '14px', md: '16px', lg: '16px', xl: '16px', icon: '16px',
}

const GHOST_HOVER_CLASS: Record<ButtonColorScheme, string> = {
  primary: 'hover:bg-[var(--ds-primary-subtle)]',
  success: 'hover:bg-[var(--ds-surface-up)]',
  warning: 'hover:bg-[var(--ds-surface-up)]',
  danger:  'hover:bg-[var(--ds-surface-up)]',
  neutral: 'hover:bg-[var(--ds-surface-up)]',
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium ring-offset-ds-bg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        xs:   'h-7 px-2.5 text-xs',
        sm:   'h-8 px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        xl:   'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { size: 'md' },
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
      style,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    let colorStyle: React.CSSProperties
    if (variant === 'solid')        colorStyle = SOLID_STYLES[colorScheme]
    else if (variant === 'outline') colorStyle = OUTLINE_STYLES[colorScheme]
    else if (variant === 'ghost')   colorStyle = GHOST_STYLES[colorScheme]
    else                            colorStyle = LINK_STYLE

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
        className={cn(
          buttonVariants({ size }),
          variant === 'solid' && 'hover:opacity-90',
          variant === 'ghost' && GHOST_HOVER_CLASS[colorScheme],
          variant === 'link' && 'underline-offset-4 hover:underline',
          className
        )}
        style={{ ...colorStyle, ...style }}
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
