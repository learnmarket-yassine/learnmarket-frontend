import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import TimeInput from './TimeInput'
import type { AvailabilityException } from '../../types/dto'
import type { ExceptionType } from '../../types/enums'
import useCreateAvailabilityException from '../../hooks/useCreateAvailabilityExceptions'
import useUpdateAvailabilityException from '../../hooks/useUpdateAvailabilityException'
import { overrideEntrySchema, type OverrideEntryFormValues } from '../../schemas'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface OverrideEntryFormProps {
  date: string
  timezone: string
  exception?: AvailabilityException | null
  initialStart?: number
  onConflict: (error: unknown) => boolean
  onDone?: () => void
  onSaved?: () => void
}

const TYPE_LABELS: Record<ExceptionType, string> = {
  BLOCKED: 'Block',
  ADDED: 'Add availability',
}

const DEFAULT_VALUES: OverrideEntryFormValues = {
  type: 'BLOCKED',
  mode: 'full',
  start: 9 * 60,
  end: 17 * 60,
  reason: '',
}

function valuesFromException(
  exception?: AvailabilityException | null,
  initialStart?: number
): OverrideEntryFormValues {
  if (!exception) {
    return initialStart === undefined
      ? DEFAULT_VALUES
      : {
          ...DEFAULT_VALUES,
          mode: 'custom',
          start: initialStart,
          end: Math.min(1440, initialStart + 60),
        }
  }
  const hasCustomRange = exception.startTime !== null && exception.endTime !== null
  return {
    type: exception.type,
    mode: hasCustomRange ? 'custom' : 'full',
    start: exception.startTime ?? DEFAULT_VALUES.start,
    end: exception.endTime ?? DEFAULT_VALUES.end,
    reason: exception.reason ?? '',
  }
}

const OverrideEntryForm = ({
  date,
  timezone,
  exception,
  initialStart,
  onConflict,
  onDone,
  onSaved,
}: OverrideEntryFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<OverrideEntryFormValues>({
    resolver: zodResolver(overrideEntrySchema),
    defaultValues: valuesFromException(exception, initialStart),
  })

  useEffect(() => {
    reset(valuesFromException(exception, initialStart))
  }, [exception, date, initialStart, reset])

  const mode = useWatch({ control, name: 'mode' })
  const createException = useCreateAvailabilityException()
  const updateException = useUpdateAvailabilityException()
  const isSaving = createException.isPending || updateException.isPending

  const onSubmit = async (values: OverrideEntryFormValues) => {
    const payload = {
      date,
      type: values.type,
      timezone,
      reason: values.reason || undefined,
      ...(values.mode === 'custom' ? { startTime: values.start, endTime: values.end } : {}),
    }
    try {
      if (exception) {
        await updateException.mutateAsync({ id: exception.id, input: payload })
      } else {
        await createException.mutateAsync(payload)
      }
      reset(DEFAULT_VALUES)
      onSaved?.()
    } catch (error) {
      if (!onConflict(error)) console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-10 p-3">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={(value) => value && field.onChange(value as ExceptionType)}
            className="w-full !gap-0"
          >
            <ToggleGroupItem
              value="BLOCKED"
              className="flex-1 rounded-none py-5 data-[state=off]:bg-[#bdc1c9] data-[state=on]:bg-[#1a46a7] data-[state=on]:text-white"
            >
              {TYPE_LABELS.BLOCKED}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="ADDED"
              className="flex-1 rounded-none py-5 data-[state=off]:bg-[#bdc1c9] data-[state=on]:bg-[#1a46a7] data-[state=on]:text-white"
            >
              {TYPE_LABELS.ADDED}
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />

      {mode === 'custom' && (
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-2">
            <Controller
              control={control}
              name="start"
              render={({ field }) => (
                <TimeInput
                  className="flex-1"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={Boolean(errors.start)}
                />
              )}
            />
            <span className="text-muted-foreground">-</span>
            <Controller
              control={control}
              name="end"
              render={({ field }) => (
                <TimeInput
                  className="flex-1"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={Boolean(errors.end)}
                />
              )}
            />
          </div>
          {errors.end && <p className="text-xs text-destructive">{errors.end.message}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="reason" className="font-semibold">
          Reason
        </Label>
        <Textarea
          id="description"
          placeholder="Reason"
          className="resize-none rounded-xl border border-[#6B7280] bg-white p-4"
          error={errors.reason?.message}
          {...register('reason')}
          maxLength={2000}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          onClick={() => {
            reset(DEFAULT_VALUES)
            onDone?.()
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

export default OverrideEntryForm
