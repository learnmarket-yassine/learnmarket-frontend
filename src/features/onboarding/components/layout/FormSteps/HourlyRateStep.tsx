import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { HourlyRateFormData, hourlyRateSchema } from '@/features/myProfile/schemas'
import useEditTutorProfile from '@/features/myProfile/hooks/useEditTutorProfile'
import { StepHandle } from '../../ui/StepperButtons'

type HourlyRateStepProps = {
  onValidityChange?: (isValid: boolean) => void
}

const HourlyRateStep = forwardRef<StepHandle, HourlyRateStepProps>(({ onValidityChange }, ref) => {
  const user = useStore((state) => state.auth.user)
  const { mutateAsync: editTutorProfileMutation } = useEditTutorProfile()

  const form = useForm<HourlyRateFormData>({
    resolver: zodResolver(hourlyRateSchema),
    mode: 'onChange',
    defaultValues: {
      hourlyRate: user?.tutorProfile?.hourlyRate ?? 0,
    },
  })

  const { register, handleSubmit, formState, watch } = form
  const { errors, isValid } = formState
  const hourlyRate = Number(watch('hourlyRate') || 0)
  const serviceFee = 1.5
  const youReceive = Math.max(hourlyRate - serviceFee, 0)

  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let succeeded = false
      await handleSubmit(async (data) => {
        await editTutorProfileMutation({ hourlyRate: data.hourlyRate })
        succeeded = true
      })()
      return succeeded
    },
  }))

  return (
    <div className="space-y-6">
      <h1 className="max-w-[400px] text-4xl font-bold text-[#1E293B]">
        Now, let's set your hourly rate.
      </h1>
      <p className="max-w-[470px] text-sm text-[#4B5563]">
        Clients will see this rate on your profile and in search results once you publish your
        profile. You can adjust your rate every time you submit a proposal.
      </p>
      <div className="divide-y-[1px] divide-[#8E949F]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <Label htmlFor="hourlyRate" className="text-lg font-bold text-[#0F172A]">
              Hourly Rate *
            </Label>
            <p className="text-sm text-[#64748B]">Total amount the learner will see</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <InputGroup
                className={`rounded-full border p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0 ${errors.hourlyRate ? 'border-red-600' : 'border-[#D9D9D9]'}`}
              >
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                    $
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="hourlyRate"
                  type="number"
                  placeholder="0.00"
                  {...register('hourlyRate', { valueAsNumber: true })}
                  className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
              <span className="text-lg text-[#1E1E1E]">/hr</span>
            </div>
            {errors.hourlyRate && (
              <p className="text-sm text-red-600">{errors.hourlyRate.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-lg font-bold text-[#0F172A]">
              YORA Service Fee
            </Label>
            <p className="max-w-[400px] text-sm text-[#64748B]">
              This helps us run the platform and provide services like payment protection and
              customer support.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InputGroup className="rounded-full border border-[#D9D9D9] bg-[#E3E3E3] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupAddon>
                <InputGroupText className="text-base font-medium text-[#1E1E1E]">$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                value={serviceFee.toFixed(2)}
                readOnly
                placeholder="0.00"
                className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </InputGroup>
            <span className="text-lg text-[#1E1E1E]">/hr</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-lg font-bold text-[#0F172A]">
              You'll Receive
            </Label>
            <p className="text-sm text-[#64748B]">
              The estimated amount you'll receive after service fees
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupAddon>
                <InputGroupText className="text-base font-medium text-[#1E1E1E]">$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={youReceive.toFixed(2)}
                readOnly
                type="number"
                placeholder="0.00"
                className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </InputGroup>
            <span className="text-lg text-[#1E1E1E]">/hr</span>
          </div>
        </div>
      </div>
    </div>
  )
})

HourlyRateStep.displayName = 'HourlyRateStep'

export default HourlyRateStep
