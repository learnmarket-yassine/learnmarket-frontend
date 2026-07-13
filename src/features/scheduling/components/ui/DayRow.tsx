import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormState, useWatch, type Control } from 'react-hook-form'
import TimeInput from './TimeInput'
import { dayLabel } from '../../utils/time'
import { WeeklyHoursFormValues } from '../../schemas'

interface DayRowProps {
  control: Control<WeeklyHoursFormValues>
  dayIndex: number
}

const DEFAULT_SLOT_LENGTH_MINUTES = 60

const DayRow = ({ control, dayIndex }: DayRowProps) => {
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
    <div className="flex flex-row items-start gap-10 py-4">
      <div className="flex shrink-0 items-center gap-4">
        <Controller
          control={control}
          name={`days.${dayIndex}.enabled`}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <span className="font-bold">{dayLabel(dayOfWeek)}</span>
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
                  <span>-</span>
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

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              onClick={handleAddSlot}
              className="p-0 font-semibold text-[#102A63]"
            >
              <Plus className="size-5" /> <span>Add slot </span>
            </Button>
          </div>
        </div>
      ) : (
        <span className="text-base">Unavailable</span>
      )}
    </div>
  )
}

export default DayRow
