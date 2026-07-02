import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TutorOnboardingFormData, tutorOnboardingSchema } from '../schemas'
import useCompleteTutorOnboarding from '../hooks/useCompleteTutorOnboarding'

const TutorOnboardingForm = () => {
  const { mutate: completeOnboarding, isPending, isError } = useCompleteTutorOnboarding()

  const form = useForm<TutorOnboardingFormData>({
    resolver: zodResolver(tutorOnboardingSchema),
    defaultValues: {
      headline: '',
      bio: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form

  const remainingCharacters = 5000 - (watch('bio')?.length ?? 0)

  const onSubmit: SubmitHandler<TutorOnboardingFormData> = (data) => {
    completeOnboarding(data)
  }

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="headline" className="text-base font-bold text-[#5E5E5E]">
          Your title <span>*</span>
        </Label>
        <CustomInput
          type="text"
          id="headline"
          placeholder="Digital Marketing | Video Editing, Video Editing & Production, Logo"
          className="rounded-full border bg-white"
          width="w-full"
          error={errors.headline?.message}
          {...register('headline')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio" className="text-base font-bold text-[#5E5E5E]">
          Profile overview <span>*</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Describe your strengths, skills and experience"
          className="h-[160px] resize-none rounded-xl border bg-white p-4"
          error={errors.bio?.message}
          maxLength={5000}
          {...register('bio')}
        />
        <div className="flex justify-end">
          <p className="text-sm text-[#5E5E5E]">{remainingCharacters} left</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hourlyRate" className="text-base font-bold text-[#5E5E5E]">
          Your hourly rate ($) <span>*</span>
        </Label>
        <CustomInput
          type="number"
          id="hourlyRate"
          min={0}
          step="0.01"
          placeholder="25"
          className="rounded-full border bg-white"
          width="w-full"
          error={errors.hourlyRate?.message}
          {...register('hourlyRate', { valueAsNumber: true })}
        />
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          Something went wrong while saving your profile. Please try again.
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-full w-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
      >
        {isPending ? 'Saving...' : 'Complete my profile'}
      </Button>
    </form>
  )
}

export default TutorOnboardingForm
