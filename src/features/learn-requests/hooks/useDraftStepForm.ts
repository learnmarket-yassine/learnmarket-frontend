import { type Ref, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form'
import type { ZodType } from 'zod'
import { StepHandle } from '@/features/learn-requests/store/types'
import useUpdateLearnRequest from '@/features/learn-requests/hooks/useUpdateLearnRequest'

type UseDraftStepFormArgs<T extends FieldValues> = {
  ref: Ref<StepHandle>
  schema: ZodType<T>
  defaultValues: DefaultValues<T>
  draftId: string
  onValidityChange: (isValid: boolean) => void
  /** Shapes the values sent to the PATCH call. Defaults to the raw form values. */
  toPayload?: (values: T) => Record<string, unknown>
  /** Shapes the values exposed via the step's imperative `getValues()`. Defaults to the raw form values. */
  toExposedValues?: (values: T) => Record<string, unknown>
}

/**
 * Wraps the pattern every wizard step repeats: an RHF + zod form that reports
 * its live validity up to the orchestrator and, on submit, validates then
 * PATCHes the draft with its own slice of data.
 */
export function useDraftStepForm<T extends FieldValues>({
  ref,
  schema,
  defaultValues,
  draftId,
  onValidityChange,
  toPayload,
  toExposedValues,
}: UseDraftStepFormArgs<T>) {
  const { mutateAsync: patchDraft } = useUpdateLearnRequest()

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  })

  const { formState, getValues, trigger } = form
  const { isValid } = formState

  useEffect(() => {
    onValidityChange(isValid)
  }, [isValid, onValidityChange])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger()
      if (!valid) return false
      try {
        const values = getValues()
        await patchDraft({ id: draftId, payload: toPayload ? toPayload(values) : values })
        return true
      } catch {
        return false
      }
    },
    getValues: () => {
      const values = getValues()
      return toExposedValues ? toExposedValues(values) : values
    },
  }))

  return form
}
