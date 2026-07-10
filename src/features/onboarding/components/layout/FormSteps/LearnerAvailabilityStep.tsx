import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '@/store/store'
import { LearnerAvailabilityFormData, learnerAvailabilitySchema } from '../../../schemas'
import useUpdateLearnerAvailability from '@/features/myProfile/hooks/useUpdateLearnerAvailability'
import { StepHandle } from '../../ui/StepperButtons'
import AvailabilityGrid from '../../ui/AvailabilityGrid'

type LearnerAvailabilityStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const LearnerAvailabilityStep = forwardRef<StepHandle, LearnerAvailabilityStepProps>(
  ({ onValidityChange }, ref) => {
    const user = useStore((state) => state.auth.user)
    const { mutateAsync: updateAvailabilityMutation } = useUpdateLearnerAvailability()

    const form = useForm<LearnerAvailabilityFormData>({
      resolver: zodResolver(learnerAvailabilitySchema),
      mode: 'onChange',
      defaultValues: {
        slots: user?.learnerProfile?.availability ?? [],
      },
    })

    const { handleSubmit, formState, control } = form
    const { errors, isValid } = formState

    useEffect(() => {
      onValidityChange?.(isValid)
    }, [isValid, onValidityChange])

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let succeeded = false
        await handleSubmit(async (data) => {
          await updateAvailabilityMutation(data.slots)
          succeeded = true
        })()
        return succeeded
      },
    }))

    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#143681]">When are you available to learn?</h1>
          <p className="text-base text-[#6B7280]">
            Select the days and times that work best for you. You can change these choices later on.
          </p>
        </div>
        <Controller
          name="slots"
          control={control}
          render={({ field }) => <AvailabilityGrid value={field.value} onChange={field.onChange} />}
        />
        {errors.slots && <p className="text-sm text-red-600">{errors.slots.message}</p>}
      </div>
    )
  }
)

LearnerAvailabilityStep.displayName = 'LearnerAvailabilityStep'

export default LearnerAvailabilityStep
