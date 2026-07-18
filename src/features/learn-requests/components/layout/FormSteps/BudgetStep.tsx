import { forwardRef } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { BudgetFormData, budgetSchema } from '@/features/learn-requests/schemas'
import { StepHandle } from '@/features/learn-requests/store/types'
import { useDraftStepForm } from '@/features/learn-requests/hooks/useDraftStepForm'

type BudgetStepProps = {
  draftId: string
  defaultBudgetMin: number | null
  defaultBudgetMax: number | null
  onValidityChange: (isValid: boolean) => void
}

const BudgetStep = forwardRef<StepHandle, BudgetStepProps>(
  ({ draftId, defaultBudgetMin, defaultBudgetMax, onValidityChange }, ref) => {
    const { register, formState } = useDraftStepForm<BudgetFormData>({
      ref,
      schema: budgetSchema,
      draftId,
      onValidityChange,
      defaultValues: {
        budgetMin: defaultBudgetMin ?? undefined,
        budgetMax: defaultBudgetMax ?? undefined,
      },
    })
    const { errors } = formState

    return (
      <div className="grid min-h-0 w-full flex-1 grid-cols-5 gap-12">
        <div className="col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-[#143681]">Set your budget.</h1>
          <p className="max-w-[400px] text-base text-[#6B7280]">
            Set a budget range for this request. The more realistic it is, the easier it is for
            tutors to send relevant proposals.
          </p>
        </div>
        <div className="col-span-3 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-min" className="text-sm font-semibold">
                From
              </Label>
              <div className="flex items-center gap-2">
                <InputGroup
                  className={`${errors.budgetMin ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-full border p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0`}
                >
                  <InputGroupAddon>
                    <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                      $
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="budget-min"
                    type="number"
                    placeholder="0.00"
                    className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...register('budgetMin', { valueAsNumber: true })}
                  />
                </InputGroup>
              </div>
              {errors.budgetMin && (
                <p className="text-xs text-red-600">{errors.budgetMin.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-max" className="text-sm font-semibold">
                To
              </Label>
              <div className="flex items-center gap-2">
                <InputGroup
                  className={`${errors.budgetMax ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-full border p-5 has-[[data-slot=input-group-control]:focus-visible]:border-[#D9D9D9] has-[[data-slot=input-group-control]:focus-visible]:ring-0`}
                >
                  <InputGroupAddon>
                    <InputGroupText className="text-base font-medium text-[#1E1E1E]">
                      $
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="budget-max"
                    type="number"
                    placeholder="0.00"
                    className="text-lg text-[#1E1E1E] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...register('budgetMax', { valueAsNumber: true })}
                  />
                </InputGroup>
              </div>
              {errors.budgetMax && (
                <p className="text-xs text-red-600">{errors.budgetMax.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

BudgetStep.displayName = 'BudgetStep'

export default BudgetStep
