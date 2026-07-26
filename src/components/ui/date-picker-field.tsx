import { useState } from 'react'
import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerFieldProps {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  disabled?: boolean
  fromDate?: Date
}

const DATE_FORMAT = 'yyyy-MM-dd'

export function DatePickerField({
  value,
  onChange,
  onBlur,
  placeholder = 'Pick a date',
  error,
  disabled,
  fromDate,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parse(value, DATE_FORMAT, new Date()) : undefined

  return (
    <div className="relative w-full">
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) onBlur?.()
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'border-inputBorder bg-inputBackground placeholder:text-placeholder flex h-10 w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              !selected && 'text-placeholder',
              error && 'border-red-600 focus-visible:ring-transparent'
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-[#6B7280]" />
            {selected ? format(selected, 'MMM d, yyyy') : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            disabled={fromDate ? { before: fromDate } : undefined}
            onSelect={(date) => {
              onChange(date ? format(date, DATE_FORMAT) : '')
              setOpen(false)
              onBlur?.()
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="absolute left-2 block overflow-hidden text-ellipsis whitespace-nowrap px-1 text-xs font-normal text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default DatePickerField
