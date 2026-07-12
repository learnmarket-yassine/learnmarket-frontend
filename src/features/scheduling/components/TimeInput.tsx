import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { minutesToTimeString, timeStringToMinutes } from '../utils/time'

export interface TimeInputProps {
  value: number
  onChange: (minutes: number) => void
  onBlur?: () => void
  className?: string
  id?: string
  'aria-invalid'?: boolean
}

/** Free-text HH:mm input, always showing the full time — never a truncated native `<input type="time">`. */
const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onChange, onBlur, className, ...rest }, ref) => {
    const [text, setText] = React.useState(() => minutesToTimeString(value))

    React.useEffect(() => {
      setText(minutesToTimeString(value))
    }, [value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = event.target.value.replace(/[^\d:]/g, '').slice(0, 5)
      setText(sanitized)
    }

    const handleBlur = () => {
      try {
        onChange(timeStringToMinutes(text))
      } catch {
        setText(minutesToTimeString(value))
      }
      onBlur?.()
    }

    return (
      <Input
        ref={ref}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        inputMode="numeric"
        placeholder="HH:mm"
        className={cn('w-20 text-center tabular-nums', className)}
        {...rest}
      />
    )
  }
)
TimeInput.displayName = 'TimeInput'

export default TimeInput
