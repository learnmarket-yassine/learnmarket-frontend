import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PAYOUT_METHOD_LABELS } from '@/features/proposal/constants/labels'
import { ProposalFormValues } from '@/features/proposal/schemas'
import { SERVICE_FEE_PERCENT } from '@/lib/Constants'
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'

type ProposalTermsSectionProps = {
  control: Control<ProposalFormValues>
  register: UseFormRegister<ProposalFormValues>
  errors: FieldErrors<ProposalFormValues>
  isSingleSession: boolean
  totalPrice: number
}

const ProposalTermsSection: React.FC<ProposalTermsSectionProps> = ({
  control,
  register,
  errors,
  isSingleSession,
  totalPrice,
}) => {
  const serviceFee = totalPrice * SERVICE_FEE_PERCENT
  const learnerTotal = totalPrice * (1 + SERVICE_FEE_PERCENT)
  return (
    <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
      <h3 className="text-xl font-bold">Terms</h3>
      <div className="space-y-4">
        <p>How do you want to be paid?</p>
        <Controller
          control={control}
          name="payoutMethod"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSingleSession}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <RadioGroupItem value="PER_SESSION" id="r1" />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="r1" className="text-base font-bold">
                    {PAYOUT_METHOD_LABELS.PER_SESSION}
                  </Label>
                  <p className="text-[#5E5E5E]">
                    You'll be paid for each session after it has been completed and approved.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RadioGroupItem value="ON_COMPLETION" id="r2" />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="r2" className="text-base font-bold">
                    {PAYOUT_METHOD_LABELS.ON_COMPLETION}
                  </Label>
                  <p className="text-[#5E5E5E]">
                    Receive your full payment after all sessions have been completed and approved by
                    the learner.
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}
        />
        {isSingleSession && (
          <p className="text-xs text-[#6B7280]">A single session is always paid by course.</p>
        )}
        {errors.payoutMethod && (
          <p className="text-xs text-destructive">{errors.payoutMethod.message}</p>
        )}
      </div>
      <div className="divide-y-[1px] divide-[#8E949F]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
              Your Earnings
            </Label>
            <p className="text-base text-[#5E5E5E]">The amount you'll receive.</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                <InputGroupAddon>
                  <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                    $
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="0.00"
                  {...register('totalPrice', { valueAsNumber: true })}
                  className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
            </div>
            {errors.totalPrice && (
              <p className="text-sm text-red-600">{errors.totalPrice.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
              YORA Service Fee
            </Label>
            <p className="text-base text-[#5E5E5E]">10% platform service fee.</p>
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
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-base font-bold text-[#143681]">
              Learner Total
            </Label>
            <p className="text-base text-[#5E5E5E]">The total amount the learner will pay.</p>
          </div>
          <div className="flex items-center gap-2">
            <InputGroup className="rounded-full border border-[#D9D9D9] p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupAddon>
                <InputGroupText className="text-base font-medium text-[#1E1E1E]">$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={learnerTotal.toFixed(2)}
                readOnly
                type="number"
                placeholder="0.00"
                className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalTermsSection
