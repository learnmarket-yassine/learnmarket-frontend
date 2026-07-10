import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AvailabilityDay, AvailabilitySlotTime, AvailabilitySlotValue } from '../../store/types'

type AvailabilityCircleGridProps = {
  value: AvailabilitySlotValue[]
  onChange?: (value: AvailabilitySlotValue[]) => void
  editable?: boolean
}

const DAYS: { value: AvailabilityDay; label: string }[] = [
  { value: 'MON', label: 'M' },
  { value: 'TUE', label: 'T' },
  { value: 'WED', label: 'W' },
  { value: 'THU', label: 'T' },
  { value: 'FRI', label: 'F' },
  { value: 'SAT', label: 'S' },
  { value: 'SUN', label: 'S' },
]

const SLOTS: { value: AvailabilitySlotTime; label: string }[] = [
  { value: 'MORNING', label: 'MOR' },
  { value: 'AFTERNOON', label: 'AFT' },
  { value: 'EVENING', label: 'EVE' },
]

function AvailabilityCircleGrid({
  value,
  onChange,
  editable = false,
}: AvailabilityCircleGridProps) {
  const isSelected = (day: AvailabilityDay, slot: AvailabilitySlotTime) =>
    value.some((entry) => entry.day === day && entry.slot === slot)

  const toggle = (day: AvailabilityDay, slot: AvailabilitySlotTime) => {
    if (!editable || !onChange) return
    if (isSelected(day, slot)) {
      onChange(value.filter((entry) => !(entry.day === day && entry.slot === slot)))
    } else {
      onChange([...value, { day, slot }])
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid min-w-[380px] grid-cols-[40px_repeat(7,1fr)] items-center gap-x-2 gap-y-3">
        <div />
        {DAYS.map((day, i) => (
          <div
            key={`${day.value}-${i}`}
            className="text-center text-sm font-semibold text-[#143681]"
          >
            {day.label}
          </div>
        ))}
        {SLOTS.map((slot) => (
          <Fragment key={slot.value}>
            <span className="text-xs font-semibold text-[#143681]">{slot.label}</span>
            {DAYS.map((day, i) => {
              const selected = isSelected(day.value, slot.value)
              return (
                <button
                  key={`${day.value}-${i}-${slot.value}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${day.value} ${slot.label}`}
                  disabled={!editable}
                  onClick={() => toggle(day.value, slot.value)}
                  className={cn(
                    'mx-auto flex size-12 items-center justify-center rounded-full transition-colors',
                    selected ? 'bg-[#2563EB] text-white' : 'bg-[#D1D5DB]',
                    editable && 'hover:opacity-80',
                    !editable && 'cursor-default'
                  )}
                >
                  {selected && <Check className="size-5" />}
                </button>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default AvailabilityCircleGrid
