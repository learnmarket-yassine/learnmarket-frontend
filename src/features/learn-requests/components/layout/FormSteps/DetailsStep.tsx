import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DetailsFormData, detailsSchema } from '@/features/learn-requests/schemas'
import { StepHandle } from '@/features/learn-requests/store/types'
import { useDraftStepForm } from '@/features/learn-requests/hooks/useDraftStepForm'

type DetailsStepProps = {
  draftId: string
  defaultDescription: string
  onValidityChange: (isValid: boolean) => void
}

const DetailsStep = forwardRef<StepHandle, DetailsStepProps>(
  ({ draftId, defaultDescription, onValidityChange }, ref) => {
    const { register, formState } = useDraftStepForm<DetailsFormData>({
      ref,
      schema: detailsSchema,
      draftId,
      onValidityChange,
      defaultValues: { description: defaultDescription },
    })
    const { errors } = formState

    return (
      <div className="grid min-h-0 w-full flex-1 grid-cols-5 gap-12">
        <div className="col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-[#143681]">Describe your request.</h1>
          <p className="max-w-[400px] text-base text-[#6B7280]">
            Provide a clear description of what you want to achieve. The more details you share, the
            easier it is for tutors to understand your goals and send relevant proposals.
          </p>
        </div>
        <div className="col-span-3 space-y-8">
          <div className="space-y-2">
            <Label
              htmlFor="learn-request-description"
              className="text-sm font-semibold text-[#374151]"
            >
              Description
            </Label>
            <Textarea
              id="learn-request-description"
              rows={8}
              placeholder="What do you want to learn, and why?"
              className="rounded-2xl border border-[#D1D5DB] bg-white"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

DetailsStep.displayName = 'DetailsStep'

export default DetailsStep
