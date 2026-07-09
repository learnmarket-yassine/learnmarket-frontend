import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '@/store/store'
import { OnboardingSpecialtiesFormData, onboardingSpecialtiesSchema } from '../../../schemas'
import useReplaceTutorSpecialties from '@/features/myProfile/hooks/useReplaceTutorSpecialties'
import { StepHandle } from '../../ui/StepperButtons'
import CategorySpecialtyPicker from '@/features/myProfile/components/ui/Specialties/CategorySpecialtyPicker'

type SpecialtiesStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const SpecialtiesStep = forwardRef<StepHandle, SpecialtiesStepProps>(
  ({ onValidityChange }, ref) => {
    const user = useStore((state) => state.auth.user)
    const { mutateAsync: replaceTutorSpecialtiesMutation } = useReplaceTutorSpecialties()

    const form = useForm<OnboardingSpecialtiesFormData>({
      resolver: zodResolver(onboardingSpecialtiesSchema),
      mode: 'onChange',
      defaultValues: {
        specialties: user?.tutorProfile?.specialties ?? [],
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
          await replaceTutorSpecialtiesMutation(data.specialties)
          succeeded = true
        })()
        return succeeded
      },
    }))

    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#143681]">
            Great, so what kind of work are you here to do?
          </h1>
          <p className="text-base text-[#6B7280]">
            Don't worry, you can change these choices later on.
          </p>
        </div>
        <Controller
          name="specialties"
          control={control}
          render={({ field }) => (
            <CategorySpecialtyPicker
              error={errors.specialties?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    )
  }
)

SpecialtiesStep.displayName = 'SpecialtiesStep'

export default SpecialtiesStep
