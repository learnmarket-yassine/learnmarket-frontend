import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '@/store/store'
import { OnboardingInterestsFormData, onboardingInterestsSchema } from '../../../schemas'
import useReplaceLearnerInterests from '@/features/myProfile/hooks/useReplaceLearnerInterests'
import { StepHandle } from '../../ui/StepperButtons'
import CategorySpecialtyPicker from '@/features/myProfile/components/ui/Specialties/CategorySpecialtyPicker'

type LearnerInterestsStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const LearnerInterestsStep = forwardRef<StepHandle, LearnerInterestsStepProps>(
  ({ onValidityChange }, ref) => {
    const user = useStore((state) => state.auth.user)
    const { mutateAsync: replaceLearnerInterestsMutation } = useReplaceLearnerInterests()

    const form = useForm<OnboardingInterestsFormData>({
      resolver: zodResolver(onboardingInterestsSchema),
      mode: 'onChange',
      defaultValues: {
        interests: user?.learnerProfile?.interests ?? [],
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
          await replaceLearnerInterestsMutation(data.interests)
          succeeded = true
        })()
        return succeeded
      },
    }))

    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#143681]">
            Great, so what are you here to learn?
          </h1>
          <p className="text-base text-[#6B7280]">
            Don't worry, you can change these choices later on.
          </p>
        </div>
        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <CategorySpecialtyPicker
              minSpecialties={1}
              maxSpecialties={20}
              error={errors.interests?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    )
  }
)

LearnerInterestsStep.displayName = 'LearnerInterestsStep'

export default LearnerInterestsStep
