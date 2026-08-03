import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MentorAvatar from '@/assets/images/onboarding-avatar.png'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { OnboardingSkillsFormData, onboardingSkillsSchema } from '../../../schemas'
import useReplaceTutorSkills from '@/features/myProfile/hooks/useReplaceTutorSkills'
import { StepHandle } from '../../ui/StepperButtons'
import SkillsInput from '@/features/myProfile/components/ui/Skills/SkillsInput'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'

type SkillsStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const SkillsStep = forwardRef<StepHandle, SkillsStepProps>(({ onValidityChange }, ref) => {
  const user = useStore((state) => state.auth.user)
  const { mutateAsync: replaceTutorSkillsMutation } = useReplaceTutorSkills()

  const form = useForm<OnboardingSkillsFormData>({
    resolver: zodResolver(onboardingSkillsSchema),
    mode: 'onChange',
    defaultValues: {
      skills: user?.tutorProfile?.skills ?? [],
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
        await replaceTutorSkillsMutation(data.skills)
        succeeded = true
      })()
      return succeeded
    },
  }))

  return (
    <div className="flex w-full items-start justify-between">
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-[#1E293B]">
            Nearly there! What work are you here to do?
          </h1>
          <p className="max-w-[520px] text-sm text-[#4B5563]">
            Your skills help learners understand what you teach and help us recommend relevant
            learning requests. Add or remove the suggested subjects, or search for additional ones
            that match your expertise.
          </p>
          <p className="font-semibold text-[#2563EB]">Why choosing carefully matters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-sm font-semibold text-[#374151]">
            Your skills
          </Label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <div className="space-y-5">
                <SkillsInput
                  className="h-full rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                  maxSkills={20}
                  error={errors.skills?.message}
                />
                {field.value.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected skills</p>
                    <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg border border-[#E0E2E6] p-3">
                      {field.value.map((skill) => (
                        <SkillChip
                          key={skill.id}
                          name={skill.name}
                          id={skill.id}
                          onRemove={(id) => field.onChange(field.value.filter((s) => s.id !== id))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="space-y-4 rounded-3xl bg-[#F3F3FE] p-8">
        <Avatar className="h-12 w-12 after:border-none">
          <AvatarImage src={MentorAvatar} alt={'mentor avatar'} />
          <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
            mentor avatar
          </AvatarFallback>
        </Avatar>
        <p className="max-w-96 text-lg font-medium text-[#1E293B]">
          Our matching system recommends relevant learning requests based on the subjects you teach.
          Choose your subjects carefully to receive the best matches.
        </p>
        <p className="text-sm font-semibold text-[#6B7280]">Yora Learning Pro Tip</p>
      </div>
    </div>
  )
})

SkillsStep.displayName = 'SkillsStep'

export default SkillsStep
