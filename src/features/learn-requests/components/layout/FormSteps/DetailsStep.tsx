import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
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
    const { control, formState } = useDraftStepForm<DetailsFormData>({
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="What do you want to learn, and why?"
                  className="rounded-2xl border border-[#D1D5DB] bg-white"
                  contentClassName="min-h-[180px]"
                  error={errors.description?.message}
                />
              )}
            />
          </div>
        </div>
      </div>
    )
  }
)

DetailsStep.displayName = 'DetailsStep'

export default DetailsStep
