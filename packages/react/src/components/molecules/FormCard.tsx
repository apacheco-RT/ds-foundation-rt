import * as React from "react"
import { cn } from "../utils"
import { Check, Circle } from "lucide-react"

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
  icon?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  selectionType?: 'radio' | 'checkbox'
  layout?: 'tall' | 'long'
  onClick?: () => void
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({
    label, description, icon, selected = false, disabled = false,
    selectionType = 'radio', layout = 'tall', onClick, className, ...props
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick?.()
      }
    }

    const Indicator = selectionType === 'checkbox' ? Check : Circle

    return (
      <div
        ref={ref}
        role="button"
        aria-pressed={selected}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'border rounded-lg p-4 transition-all duration-150 outline-none',
          'focus-visible:ring-4 focus-visible:ring-[#65BEFF] focus-visible:ring-offset-0',
          selected ? 'border-ds-primary bg-ds-primary-subtle' : 'border-ds-border bg-ds-surface',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-ds-primary',
          layout === 'long' ? 'flex items-center gap-3' : 'flex flex-col gap-2',
          className
        )}
        {...props}
      >
        <Indicator
          aria-hidden="true"
          className={cn('w-4 h-4 shrink-0', selected ? 'text-ds-primary' : 'text-ds-border')}
        />
        {icon && <span aria-hidden="true" className="text-ds-text-muted">{icon}</span>}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-ds-text">{label}</span>
          {description && <span className="text-xs text-ds-text-muted">{description}</span>}
        </div>
      </div>
    )
  }
)
FormCard.displayName = 'FormCard'

export { FormCard }
