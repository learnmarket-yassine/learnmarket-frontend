import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { AvailabilityRule } from '../../types/dto'

import { diffWeeklyHours } from './weeklyHoursDiff'
import DayRow from './DayRow'
import useCreateAvailabilityRule from '../../hooks/useCreateAvailabilityRules'
import useUpdateAvailabilityRule from '../../hooks/useUpdateAvailabilityRules'
import useDeleteAvailabilityRule from '../../hooks/useDeleteAvailabilityRule'
import { type WeeklyHoursFormValues, weeklyHoursSchema } from '../../schemas'

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
  const { control, handleSubmit, formState } = useForm<WeeklyHoursFormValues>({
    resolver: zodResolver(weeklyHoursSchema),
    defaultValues: buildDefaultValues(rules),
  })

  const createRule = useCreateAvailabilityRule()
  const updateRule = useUpdateAvailabilityRule()
  const { handleDeleteAvailabilityRule, isPending: isDeletePending } = useDeleteAvailabilityRule()
  const isSaving = createRule.isPending || updateRule.isPending || isDeletePending

  const onSubmit = async (values: WeeklyHoursFormValues) => {
    const { toCreate, toUpdate, toDelete } = diffWeeklyHours(rules, values, timezone)
    try {
      await Promise.all([
        ...toCreate.map((input) => createRule.mutateAsync(input)),
        ...toUpdate.map(({ id, input }) => updateRule.mutateAsync({ id, input })),
        ...toDelete.map((id) => handleDeleteAvailabilityRule(id)),
      ])
    } catch (error) {
      if (!onConflict(error)) console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
      {Array.from({ length: 7 }, (_, dayIndex) => (
        <DayRow key={dayIndex} control={control} dayIndex={dayIndex} />
      ))}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed"
          disabled={!formState.isDirty || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

export default WeeklyHoursForm
