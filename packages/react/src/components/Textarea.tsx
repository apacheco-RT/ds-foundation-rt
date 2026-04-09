import * as React from "react"
import { cn } from "./utils"

type TextareaSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<TextareaSize, string> = {
  sm: 'min-h-[64px] text-sm',
  md: 'min-h-[80px] text-sm',
  lg: 'min-h-[100px] text-base',
}

const BASE_TEXTAREA =
  'flex w-full rounded-md border border-ds-border bg-ds-bg px-3 py-2 ring-offset-ds-bg ' +
  'placeholder:text-ds-text-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string
  helperText?: string
  errorText?: string
  size?: TextareaSize
  // `required` is inherited — used to add * to label
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      size = 'md',
      required,
      id: propId,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = propId ?? generatedId
    const hasError = !!errorText
    const hasComposite = !!(label || helperText || errorText)

    const textareaEl = (
      <textarea
        id={textareaId}
        className={cn(
          BASE_TEXTAREA,
          SIZE_CLASSES[size],
          hasError && 'border-ds-danger focus-visible:ring-ds-danger',
          className
        )}
        ref={ref}
        required={required}
        aria-invalid={hasError || undefined}
        {...props}
      />
    )

    // Bare mode: no composite props — render exactly like before
    if (!hasComposite) {
      return textareaEl
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-ds-text">
            {label}
            {required && (
              <span className="text-ds-danger ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        {textareaEl}
        {(helperText || errorText) && (
          <p className={cn('text-xs', hasError ? 'text-ds-danger' : 'text-ds-text-muted')}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
