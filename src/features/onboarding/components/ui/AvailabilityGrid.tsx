import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AvailabilityDay,
  AvailabilitySlotTime,
  AvailabilitySlotValue,
} from '@/features/myProfile/store/types'

type AvailabilityGridProps = {
  value: AvailabilitySlotValue[]
  onChange: (value: AvailabilitySlotValue[]) => void
}

const DAYS: { value: AvailabilityDay; label: string }[] = [
  { value: 'MON', label: 'Mon' },
  { value: 'TUE', label: 'Tue' },
  { value: 'WED', label: 'Wed' },
  { value: 'THU', label: 'Thu' },
  { value: 'FRI', label: 'Fri' },
  { value: 'SAT', label: 'Sat' },
  { value: 'SUN', label: 'Sun' },
]

const SLOTS: { value: AvailabilitySlotTime; label: string; time: string }[] = [
  { value: 'MORNING', label: 'Morning', time: '6:00 AM - 12:00 PM' },
  { value: 'AFTERNOON', label: 'Afternoon', time: '12:00 PM - 6:00 PM' },
  { value: 'EVENING', label: 'Evening', time: '6:00 PM - 10:00 PM' },
]

function AvailabilityGrid({ value, onChange }: AvailabilityGridProps) {
  const isSelected = (day: AvailabilityDay, slot: AvailabilitySlotTime) =>
    value.some((entry) => entry.day === day && entry.slot === slot)

  const toggle = (day: AvailabilityDay, slot: AvailabilitySlotTime) => {
    if (isSelected(day, slot)) {
      onChange(value.filter((entry) => !(entry.day === day && entry.slot === slot)))
    } else {
      onChange([...value, { day, slot }])
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid min-w-[680px] grid-cols-[180px_repeat(7,1fr)] items-center gap-x-3 gap-y-4">
        <div />
        {DAYS.map((day) => (
          <div key={day.value} className="text-center text-sm font-semibold text-[#143681]">
            {day.label}
          </div>
        ))}
        {SLOTS.map((slot) => (
          <Fragment key={slot.value}>
            <div className="flex flex-col justify-center pr-4">
              <span className="text-sm font-semibold text-[#143681]">{slot.label}</span>
              <span className="text-xs text-[#9CA3AF]">({slot.time})</span>
            </div>
            {DAYS.map((day) => {
              const selected = isSelected(day.value, slot.value)
              return (
                <button
                  key={`${day.value}-${slot.value}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${day.label} ${slot.label}`}
                  onClick={() => toggle(day.value, slot.value)}
                  className={cn(
                    'flex h-12 w-full items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]',
                    selected ? 'bg-[#2563EB] text-white' : 'bg-[#D1D5DB] hover:bg-[#B8BEC7]'
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

export default AvailabilityGrid
