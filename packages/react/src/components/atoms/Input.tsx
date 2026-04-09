import * as React from "react"
import { cn } from "../utils"

type InputSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

// Extra horizontal padding when adornments are present, by size tier
const LEFT_PADDING: Record<InputSize, string> = {
  sm: 'pl-9', md: 'pl-10', lg: 'pl-11',
}
const RIGHT_PADDING: Record<InputSize, string> = {
  sm: 'pr-9', md: 'pr-10', lg: 'pr-11',
}

const BASE_INPUT =
  'flex w-full rounded-md border border-ds-border bg-ds-bg px-3 py-2 ring-offset-ds-bg ' +
  'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
  'placeholder:text-ds-text-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorText?: string
  size?: InputSize
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  // `required` is inherited from InputHTMLAttributes — used to add * to label
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      errorText,
      size = 'md',
      leftAdornment,
      rightAdornment,
      required,
      style,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const { id: propId, ...rest } = props
    const inputId = propId ?? generatedId

    const hasError = !!errorText
    const hasComposite = !!(label || helperText || errorText || leftAdornment || rightAdornment)

    const inputEl = (
      <input
        type={type}
        className={cn(
          BASE_INPUT,
          SIZE_CLASSES[size],
          hasError && 'border-ds-danger focus-visible:ring-ds-danger',
          leftAdornment && LEFT_PADDING[size],
          rightAdornment && RIGHT_PADDING[size],
          className
        )}
        ref={ref}
        required={required}
        style={style}
        aria-invalid={hasError || undefined}
        id={inputId}
        {...rest}
      />
    )

    // Bare mode: no composite props — render exactly like before, zero regressions
    if (!hasComposite) {
      return inputEl
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ds-text">
            {label}
            {required && (
              <span className="text-ds-danger ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAdornment && (
            <span
              className="absolute left-3 flex items-center text-ds-text-muted shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              {leftAdornment}
            </span>
          )}
          {inputEl}
          {rightAdornment && (
            <span
              className="absolute right-3 flex items-center text-ds-text-muted shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              {rightAdornment}
            </span>
          )}
        </div>
        {(helperText || errorText) && (
          <p className={cn('text-xs', hasError ? 'text-ds-danger' : 'text-ds-text-muted')}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
