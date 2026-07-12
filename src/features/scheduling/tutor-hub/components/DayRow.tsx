import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormState, useWatch, type Control } from 'react-hook-form'
import TimeInput from '../../components/TimeInput'
import { dayLabel } from '../../utils/time'
import type { WeeklyHoursFormValues } from '../schemas'
import CopyToPopover from './CopyToPopover'

interface DayRowProps {
  control: Control<WeeklyHoursFormValues>
  dayIndex: number
  onCopyTo: (targetDayIndexes: number[]) => void
}

const DEFAULT_SLOT_LENGTH_MINUTES = 60

const DayRow = ({ control, dayIndex, onCopyTo }: DayRowProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.slots`,
    keyName: 'fieldKey',
  })
  const enabled = useWatch({ control, name: `days.${dayIndex}.enabled` })
  const dayOfWeek = useWatch({ control, name: `days.${dayIndex}.dayOfWeek` })
  const watchedSlots = useWatch({ control, name: `days.${dayIndex}.slots` }) ?? []
  const { errors } = useFormState({ control, name: `days.${dayIndex}` })
  const dayErrors = errors.days?.[dayIndex]

  const handleAddSlot = () => {
    const last = watchedSlots[watchedSlots.length - 1]
    const start = last ? last.end : 9 * 60
    const end = Math.min(start + DEFAULT_SLOT_LENGTH_MINUTES, 1440)
    append({ start, end })
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-start">
      <div className="flex w-28 shrink-0 items-center gap-3">
        <Controller
          control={control}
          name={`days.${dayIndex}.enabled`}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <span className="font-medium">{dayLabel(dayOfWeek)}</span>
      </div>

      {enabled ? (
        <div className="flex flex-1 flex-col gap-2">
          {fields.map((field, slotIndex) => {
            const slotError = dayErrors?.slots?.[slotIndex]
            const message = slotError?.start?.message ?? slotError?.end?.message
            return (
              <div key={field.fieldKey} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`days.${dayIndex}.slots.${slotIndex}.start`}
                    render={({ field: startField }) => (
                      <TimeInput
                        value={startField.value}
                        onChange={startField.onChange}
                        aria-invalid={Boolean(message)}
                      />
                    )}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Controller
                    control={control}
                    name={`days.${dayIndex}.slots.${slotIndex}.end`}
                    render={({ field: endField }) => (
                      <TimeInput
                        value={endField.value}
                        onChange={endField.onChange}
                        aria-invalid={Boolean(message)}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(slotIndex)}
                    aria-label="Remove time slot"
                  >
                    <Trash2 />
                  </Button>
                </div>
                {message && <p className="text-xs text-destructive">{message}</p>}
              </div>
            )
          })}

          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="sm" onClick={handleAddSlot}>
              <Plus /> Add slot
            </Button>
            <CopyToPopover dayIndex={dayIndex} onCopy={onCopyTo} />
          </div>
        </div>
      ) : (
        <span className="pt-1.5 text-sm text-muted-foreground">Unavailable</span>
      )}
    </div>
  )
}

export default DayRow
