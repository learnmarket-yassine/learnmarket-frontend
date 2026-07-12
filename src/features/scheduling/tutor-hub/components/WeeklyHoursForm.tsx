import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { AvailabilityRule } from '../../types/dto'
import {
  useCreateAvailabilityRule,
  useDeleteAvailabilityRule,
  useUpdateAvailabilityRule,
} from '../hooks/useAvailabilityRules'
import { weeklyHoursSchema, type WeeklyHoursFormValues } from '../schemas'
import { diffWeeklyHours } from '../weeklyHoursDiff'
import DayRow from './DayRow'

interface WeeklyHoursFormProps {
  rules: AvailabilityRule[]
  timezone: string
  onConflict: (error: unknown) => boolean
}

function buildDefaultValues(rules: AvailabilityRule[]): WeeklyHoursFormValues {
  return {
    days: Array.from({ length: 7 }, (_, dayOfWeek) => {
      const slots = rules
        .filter((rule) => rule.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.startTime - b.startTime)
        .map((rule) => ({ id: rule.id, start: rule.startTime, end: rule.endTime }))
      return { dayOfWeek, enabled: slots.length > 0, slots }
    }),
  }
}

const WeeklyHoursForm = ({ rules, timezone, onConflict }: WeeklyHoursFormProps) => {
  const { control, handleSubmit, formState, getValues, setValue } = useForm<WeeklyHoursFormValues>({
    resolver: zodResolver(weeklyHoursSchema),
    defaultValues: buildDefaultValues(rules),
  })

  const createRule = useCreateAvailabilityRule()
  const updateRule = useUpdateAvailabilityRule()
  const deleteRule = useDeleteAvailabilityRule()
  const isSaving = createRule.isPending || updateRule.isPending || deleteRule.isPending

  const onSubmit = async (values: WeeklyHoursFormValues) => {
    const { toCreate, toUpdate, toDelete } = diffWeeklyHours(rules, values, timezone)
    try {
      await Promise.all([
        ...toCreate.map((input) => createRule.mutateAsync(input)),
        ...toUpdate.map(({ id, input }) => updateRule.mutateAsync({ id, input })),
        ...toDelete.map((id) => deleteRule.mutateAsync(id)),
      ])
    } catch (error) {
      if (!onConflict(error)) console.error(error)
    }
  }

  const handleCopyTo = (dayIndex: number, targetIndexes: number[]) => {
    const sourceSlots = getValues(`days.${dayIndex}.slots`).map(({ start, end }) => ({
      start,
      end,
    }))
    for (const target of targetIndexes) {
      setValue(`days.${target}.enabled`, true, { shouldDirty: true })
      setValue(`days.${target}.slots`, sourceSlots, { shouldDirty: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 pb-20">
      {Array.from({ length: 7 }, (_, dayIndex) => (
        <DayRow
          key={dayIndex}
          control={control}
          dayIndex={dayIndex}
          onCopyTo={(targets) => handleCopyTo(dayIndex, targets)}
        />
      ))}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-4 sm:sticky">
        <div className="mx-auto flex max-w-3xl justify-end">
          <Button type="submit" disabled={!formState.isDirty || isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default WeeklyHoursForm
