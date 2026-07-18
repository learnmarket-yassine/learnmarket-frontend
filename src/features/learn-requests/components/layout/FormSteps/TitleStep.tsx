import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CustomInput } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { TitleFormData, titleSchema } from '@/features/learn-requests/schemas'
import { LearnRequestType, StepHandle } from '@/features/learn-requests/store/types'
import useCreateLearnRequestDraft from '@/features/learn-requests/hooks/useCreateLearnRequestDraft'
import useUpdateLearnRequest from '@/features/learn-requests/hooks/useUpdateLearnRequest'

type TitleStepProps = {
  draftId: string | null
  type: LearnRequestType | null
  defaultTitle: string
  onValidityChange: (isValid: boolean) => void
  onDraftCreated: (id: string) => void
}

const TitleStep = forwardRef<StepHandle, TitleStepProps>(
  ({ draftId, type, defaultTitle, onValidityChange, onDraftCreated }, ref) => {
    const { mutateAsync: createDraft } = useCreateLearnRequestDraft()
    const { mutateAsync: patchDraft } = useUpdateLearnRequest()

    const form = useForm<TitleFormData>({
      resolver: zodResolver(titleSchema),
      mode: 'onChange',
      defaultValues: { title: defaultTitle },
    })

    const { register, handleSubmit, formState, getValues } = form
    const { errors, isValid } = formState

    useEffect(() => {
      onValidityChange(isValid)
    }, [isValid, onValidityChange])

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let succeeded = false
        await handleSubmit(async (data) => {
          if (!draftId) {
            if (!type) return
            const created = await createDraft({ type, title: data.title })
            onDraftCreated(created.id)
          } else {
            await patchDraft({ id: draftId, payload: { title: data.title } })
          }
          succeeded = true
        })()
        return succeeded
      },
      getValues: () => getValues(),
    }))

    return (
      <div className="grid w-full flex-1 grid-cols-5 gap-12">
        <div className="col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-[#143681]">Give your request a title.</h1>
          <p className="max-w-[400px] text-base text-[#6B7280]">
            A clear, descriptive title helps tutors quickly understand what you're looking for.
          </p>
        </div>
        <div className="col-span-3 space-y-8">
          <div>
            <Label htmlFor="title" className="text-base font-bold">
              Title
            </Label>
            <CustomInput
              type="text"
              id="title"
              placeholder="Learn Adobe Illustrator for logo design"
              className="rounded-xl border border-[#6B7280] bg-white"
              width="w-full"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>
        </div>
      </div>
    )
  }
)

TitleStep.displayName = 'TitleStep'

export default TitleStep
