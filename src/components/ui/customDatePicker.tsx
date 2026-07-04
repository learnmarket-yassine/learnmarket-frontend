import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'
import { DatePicker } from '@nextui-org/date-picker'

export interface DatePickerProps extends React.ComponentPropsWithoutRef<typeof DatePicker> {
  label?: string
  required?: boolean
  width?: string
  error?: string
  disabled?: boolean
  placeholder?: Date
}

const CustomDatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ label, required, width, onChange, disabled, error, ...props }, ref) => {
    return (
      <div className={cn('pointer-events-auto grid w-full items-center gap-1.5', width)}>
        {label && (
          <Label className="text-sm font-semibold text-[#1F2937]">
            {label} {required && <span className="text-required">*</span>}
          </Label>
        )}
        <div className="relative">
          <DatePicker
            ref={ref}
            {...props}
            isDisabled={disabled}
            onChange={onChange}
            classNames={{
              base: cn(
                error ? 'border-red-600 !border-red-600' : 'border-[#E6E6E6] !border-[#E6E6E6]'
              ),
              calendar: cn('bg-white  shadow-lg relative pointer-events-auto '),
              input: 'w-full',
            }}
            popoverProps={{
              offset: 4,
              placement: 'bottom',
              style: {
                zIndex: 100000,
                position: 'fixed',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
              },
            }}
          />
          {error && (
            <span className="bg-inputBackground absolute left-2 top-3/4 px-1 text-xs text-red-600">
              {error}
            </span>
          )}
        </div>
      </div>
    )
  }
)

CustomDatePicker.displayName = 'CustomDatePicker'

export { CustomDatePicker }
