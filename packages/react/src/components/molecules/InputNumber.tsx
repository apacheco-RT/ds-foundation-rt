import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "../utils"
import { Input } from "../atoms/Input"
import { Button } from "../atoms/Button"

type BaseInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "onChange" | "value" | "defaultValue" | "type" | "min" | "max" | "step"
>

interface InputNumberProps extends BaseInputProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  onChange?: (value: number | undefined) => void
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({ value, defaultValue, min, max, step = 1, precision = 0, onChange, disabled, className, ...rest }, ref) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue !== undefined ? defaultValue.toFixed(precision) : ""
    )
    const [lastValid, setLastValid] = React.useState<number | undefined>(defaultValue)

    const displayValue = isControlled
      ? (value !== undefined ? value.toFixed(precision) : "")
      : internalValue

    const clamp = (n: number) => {
      let v = n
      if (min !== undefined) v = Math.max(min, v)
      if (max !== undefined) v = Math.min(max, v)
      return v
    }

    const commit = (raw: string) => {
      const parsed = parseFloat(raw)
      if (isNaN(parsed)) {
        if (!isControlled) setInternalValue(lastValid !== undefined ? lastValid.toFixed(precision) : "")
        return
      }
      const clamped = clamp(parsed)
      const formatted = clamped.toFixed(precision)
      if (!isControlled) {
        setInternalValue(formatted)
        setLastValid(clamped)
      }
      onChange?.(clamped)
    }

    const adjust = (delta: number) => {
      const current = isControlled ? (value ?? 0) : (lastValid ?? 0)
      commit((current + delta).toFixed(precision))
    }

    React.useEffect(() => {
      if (isControlled && !onChange) {
        if (process.env.NODE_ENV !== 'production') {
        console.warn("InputNumber: `value` provided without `onChange`. Component will be read-only.")
      }
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const currentNum = isControlled ? value : lastValid

    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          type="button" variant="ghost" size="icon" disabled={disabled || (min !== undefined && currentNum !== undefined && currentNum <= min)}
          onClick={() => adjust(-step)} aria-label="Decrease" className="h-9 w-9 shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </Button>
        <Input
          {...rest} ref={ref} type="text" inputMode="decimal"
          role="spinbutton" aria-valuemin={min} aria-valuemax={max} aria-valuenow={currentNum}
          disabled={disabled} value={displayValue}
          onChange={e => { if (!isControlled) setInternalValue(e.target.value) }}
          onBlur={e => commit(e.target.value)}
          className="text-center w-24"
        />
        <Button
          type="button" variant="ghost" size="icon" disabled={disabled || (max !== undefined && currentNum !== undefined && currentNum >= max)}
          onClick={() => adjust(step)} aria-label="Increase" className="h-9 w-9 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    )
  }
)
InputNumber.displayName = "InputNumber"

export { InputNumber }
