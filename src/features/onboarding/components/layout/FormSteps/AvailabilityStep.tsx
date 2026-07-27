import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import useGetAvailabilityRules from '@/features/scheduling/hooks/useGetAvailabilityRules'
import useUpdateWeeklyHours from '@/features/scheduling/hooks/useUpdateWeeklyHours'
import {
  buildWeeklyHoursDefaultValues,
  diffWeeklyHours,
} from '@/features/scheduling/components/ui/weeklyHoursDiff'
import DayRow from '@/features/scheduling/components/ui/DayRow'
import { getBrowserTimezone } from '@/features/scheduling/utils/timezones'
import { type WeeklyHoursFormValues, weeklyHoursSchema } from '@/features/scheduling/schemas'
import { StepHandle } from '../../ui/StepperButtons'

type AvailabilityStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const AvailabilityStep = forwardRef<StepHandle, AvailabilityStepProps>(
  ({ onValidityChange }, ref) => {
    const rulesQuery = useGetAvailabilityRules()
    const updateWeeklyHours = useUpdateWeeklyHours()
    const timezone = getBrowserTimezone()
    const [saveError, setSaveError] = useState<string | null>(null)

    const { control, handleSubmit, reset } = useForm<WeeklyHoursFormValues>({
      resolver: zodResolver(weeklyHoursSchema),
      mode: 'onChange',
      defaultValues: buildWeeklyHoursDefaultValues([]),
    })

    useEffect(() => {
      if (rulesQuery.data) reset(buildWeeklyHoursDefaultValues(rulesQuery.data))
    }, [rulesQuery.data, reset])

    const watchedDays = useWatch({ control, name: 'days' })
    const hasAtLeastOneSlot =
      watchedDays?.some((day) => day.enabled && day.slots.length > 0) ?? false
    const isValid = rulesQuery.isSuccess && hasAtLeastOneSlot

    useEffect(() => {
      onValidityChange?.(isValid)
    }, [isValid, onValidityChange])

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let succeeded = false
        setSaveError(null)
        await handleSubmit(async (values) => {
          const diff = diffWeeklyHours(rulesQuery.data ?? [], values, timezone)
          try {
            await updateWeeklyHours.mutateAsync(diff)
            succeeded = true
          } catch {
            setSaveError('Something went wrong saving your availability. Please try again.')
          }
        })()
        return succeeded
      },
    }))

    return (
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="max-w-[520px] text-4xl font-bold text-[#1E293B]">
            Almost there. When are you available to teach?
          </h1>
          <p className="max-w-[420px] text-sm text-[#4B5563]">
            Set your weekly teaching hours so clients know when they can book you. You'll be able to
            fine-tune this anytime from your Availability settings.
          </p>
        </div>

        {rulesQuery.isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : rulesQuery.isError ? (
          <p className="text-sm text-destructive">Couldn't load your weekly hours.</p>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <DayRow key={dayIndex} control={control} dayIndex={dayIndex} />
            ))}
          </div>
        )}

        {saveError && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }
)

AvailabilityStep.displayName = 'AvailabilityStep'

export default AvailabilityStep
