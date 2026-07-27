import { useState } from 'react'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { AvailabilityRule } from '../../types/dto'

import { buildWeeklyHoursDefaultValues, diffWeeklyHours } from './weeklyHoursDiff'
import DayRow from './DayRow'
import useUpdateWeeklyHours from '../../hooks/useUpdateWeeklyHours'
import { type WeeklyHoursFormValues, weeklyHoursSchema } from '../../schemas'

interface WeeklyHoursFormProps {
  rules: AvailabilityRule[]
  timezone: string
  onConflict: (error: unknown) => boolean
}

const WeeklyHoursForm = ({ rules, timezone, onConflict }: WeeklyHoursFormProps) => {
  const { control, handleSubmit, formState, reset } = useForm<WeeklyHoursFormValues>({
    resolver: zodResolver(weeklyHoursSchema),
    defaultValues: buildWeeklyHoursDefaultValues(rules),
  })
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const updateWeeklyHours = useUpdateWeeklyHours()

  const onSubmit = async (values: WeeklyHoursFormValues) => {
    const diff = diffWeeklyHours(rules, values, timezone)
    setSaveStatus(null)
    try {
      await updateWeeklyHours.mutateAsync(diff)
      setSaveStatus({ type: 'success', message: 'Your availability has been updated.' })
    } catch (error) {
      if (!onConflict(error)) {
        setSaveStatus({
          type: 'error',
          message: 'Something went wrong saving your availability. Please try again.',
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
      {Array.from({ length: 7 }, (_, dayIndex) => (
        <DayRow key={dayIndex} control={control} dayIndex={dayIndex} />
      ))}

      {saveStatus && (
        <Alert variant={saveStatus.type === 'error' ? 'destructive' : 'default'}>
          {saveStatus.type === 'error' ? <TriangleAlert /> : <CircleCheck />}
          <AlertDescription>{saveStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => reset(buildWeeklyHoursDefaultValues(rules))}
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed"
          disabled={!formState.isDirty || updateWeeklyHours.isPending}
        >
          {updateWeeklyHours.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

export default WeeklyHoursForm
