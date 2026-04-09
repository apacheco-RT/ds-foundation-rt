import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function DatePicker({ value, defaultValue, onChange, placeholder = "Pick a date", disabled, className }: DatePickerProps) {
  const isControlled = value !== undefined
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)
  const activeDate = isControlled ? value : internalDate

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setInternalDate(date)
    onChange?.(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled}
          className={cn("w-[240px] justify-start text-left font-normal", !activeDate && "text-ds-text-muted", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {activeDate ? format(activeDate, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={activeDate} onSelect={handleSelect} />
        {activeDate && (
          <div className="border-t border-ds-border p-2">
            <Button variant="ghost" size="sm" className="w-full text-ds-text-muted" onClick={() => handleSelect(undefined)}>
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
