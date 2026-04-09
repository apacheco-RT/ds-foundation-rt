import * as React from "react"
import { cn } from "./utils"

interface SegmentedOption {
  label: React.ReactNode
  value: string
  disabled?: boolean
}

export interface SegmentedProps {
  options: SegmentedOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

function Segmented({ options, value, defaultValue, onChange, className }: SegmentedProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  const activeValue = isControlled ? value : internalValue

  React.useEffect(() => {
    if (isControlled && !onChange) {
      console.warn("Segmented: `value` provided without `onChange`. Component will be read-only.")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const enabledOptions = options.filter(o => !o.disabled)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIdx = enabledOptions.findIndex(o => o.value === activeValue)
    let nextIdx = currentIdx
    if (e.key === "ArrowRight") nextIdx = (currentIdx + 1) % enabledOptions.length
    else if (e.key === "ArrowLeft") nextIdx = (currentIdx - 1 + enabledOptions.length) % enabledOptions.length
    else if (e.key === "Home") nextIdx = 0
    else if (e.key === "End") nextIdx = enabledOptions.length - 1
    else return
    e.preventDefault()
    const next = enabledOptions[nextIdx]
    if (!next) return
    if (!isControlled) setInternalValue(next.value)
    onChange?.(next.value)
  }

  const select = (optValue: string) => {
    if (!isControlled) setInternalValue(optValue)
    onChange?.(optValue)
  }

  return (
    <div
      role="radiogroup"
      onKeyDown={handleKeyDown}
      className={cn("inline-flex items-center rounded-lg border border-gray-100 bg-gray-50 p-1 gap-1", className)}
    >
      {options.map(opt => {
        const isActive = opt.value === activeValue
        return (
          <button
            key={opt.value} type="button" role="radio" aria-checked={isActive}
            disabled={opt.disabled} tabIndex={isActive ? 0 : -1}
            onClick={() => !opt.disabled && select(opt.value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { Segmented }
