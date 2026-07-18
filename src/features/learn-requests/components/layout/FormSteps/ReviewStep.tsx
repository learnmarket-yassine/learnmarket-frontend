import { useState } from 'react'
import EditButton from '@/features/myProfile/components/ui/EditButton'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import { cn } from '@/lib/utils'
import useLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import usePublishLearnRequest from '@/features/learn-requests/hooks/usePublishLearnRequest'
import {
  collectPublishErrors,
  isPublishable,
  mapLearnRequestToWizardState,
  PublishErrorField,
} from '@/features/learn-requests/validation'
import WizardFooter from '../../ui/WizardFooter'
import { TYPE_LABELS, LEVEL_LABELS } from '@/features/learn-requests/constants/labels'

const STEP = {
  FORMAT: 0,
  TITLE: 1,
  SUBJECT: 2,
  LEVEL: 3,
  BUDGET: 4,
  DETAILS: 5,
} as const

type ReviewStepProps = {
  draftId: string
  onEdit: (step: number) => void
  onBack: () => void
  onSaveDraft: () => void
  onPublished: () => void
}

const rowClass = (hasError: boolean) => cn(hasError && 'bg-red-50 ring-1 ring-inset ring-red-400')

const ReviewStep = ({ draftId, onEdit, onBack, onSaveDraft, onPublished }: ReviewStepProps) => {
  const { data, isLoading, refetch } = useLearnRequest(draftId)
  const { mutateAsync: publishDraft, isPending } = usePublishLearnRequest()
  const [errorFields, setErrorFields] = useState<Set<PublishErrorField>>(new Set())

  if (isLoading || !data) {
    return <p className="text-sm text-[#6B7280]">Loading your request…</p>
  }

  const wizardState = mapLearnRequestToWizardState(data)
  const canPublish = isPublishable(wizardState)

  const handlePublish = async () => {
    try {
      await publishDraft(draftId)
      onPublished()
    } catch {
      const fresh = await refetch()
      if (fresh.data) {
        const errors = collectPublishErrors(mapLearnRequestToWizardState(fresh.data))
        setErrorFields(new Set(errors.map((e) => e.field)))
      }
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#143681]">Learn Request Details</h1>
      </div>
      <div className="flex flex-col divide-y-[0.5px] divide-[#E0E2E6] rounded-xl border border-[#E0E2E6] bg-white">
        <div
          className={cn(
            'flex items-center justify-between p-6',
            rowClass(errorFields.has('title'))
          )}
        >
          <h1 className="text-lg font-semibold">{data.title || 'Untitled request'}</h1>
          <EditButton label="edit title" onClick={() => onEdit(STEP.TITLE)} />
        </div>
        <div
          className={cn(
            'flex items-start justify-between p-6',
            rowClass(errorFields.has('description'))
          )}
        >
          <p className="max-w-6xl text-base">{data.description || 'No description yet.'}</p>
          <EditButton label="edit description" onClick={() => onEdit(STEP.DETAILS)} />
        </div>
        <div
          className={cn('flex items-start justify-between p-6', rowClass(errorFields.has('type')))}
        >
          <div className="space-y-2">
            <h3 className="font-semibold">Learning format</h3>
            <p>{data.type ? TYPE_LABELS[data.type] : 'Not set'}</p>
          </div>
          <EditButton label="edit format" onClick={() => onEdit(STEP.FORMAT)} />
        </div>
        <div className="space-y-5 p-6">
          <div
            className={cn(
              'flex w-full items-start justify-between',
              rowClass(errorFields.has('category'))
            )}
          >
            <div className="space-y-2">
              <h3 className="font-semibold">Category</h3>
              <p>{data.category?.name ?? 'Not set'}</p>
            </div>
            <EditButton label="edit category" onClick={() => onEdit(STEP.SUBJECT)} />
          </div>
          <div
            className={cn(
              'flex w-full items-start justify-between',
              rowClass(errorFields.has('skills'))
            )}
          >
            <div className="w-full space-y-2">
              <h3 className="font-semibold">Skills</h3>
              <div className="flex max-h-[250px] flex-wrap gap-2 overflow-auto rounded-lg p-3">
                {data.skills.length === 0 && <p className="text-sm text-[#6B7280]">Not set</p>}
                {data.skills.map(({ skill }) => (
                  <SkillChip key={skill.id} name={skill.name} />
                ))}
              </div>
            </div>
            <EditButton label="edit skills" onClick={() => onEdit(STEP.SUBJECT)} />
          </div>
          <div
            className={cn(
              'flex w-full items-start justify-between',
              rowClass(
                errorFields.has('level') ||
                  errorFields.has('languages') ||
                  errorFields.has('frequency')
              )
            )}
          >
            <div className="space-y-4">
              <h3 className="font-semibold">Level preferences</h3>
              <p>{data.level ? LEVEL_LABELS[data.level] : 'Not set'}</p>
              <h3 className="font-semibold">Preferred Languages:</h3>
              <p className="font-normal">
                {data.preferredLanguages.length > 0
                  ? data.preferredLanguages.join(', ')
                  : 'Not set'}
              </p>
              {data.type === 'COURSE' && (
                <>
                  <h3 className="font-semibold">Sessions per week:</h3>
                  <p className="font-normal">
                    {data.requestedFrequency
                      ? `${data.requestedFrequency} times per week`
                      : 'Not set'}
                  </p>
                </>
              )}
            </div>
            <EditButton label="edit level preferences" onClick={() => onEdit(STEP.LEVEL)} />
          </div>
        </div>
        <div
          className={cn(
            'flex items-start justify-between p-6',
            rowClass(errorFields.has('budget'))
          )}
        >
          <div className="space-y-2">
            <h3 className="font-semibold">Budget</h3>
            <p className="text-lg font-medium">
              {wizardState.budgetMin !== null && wizardState.budgetMax !== null
                ? `$${wizardState.budgetMin} - $${wizardState.budgetMax}`
                : 'Not set'}
            </p>
          </div>
          <EditButton label="edit budget" onClick={() => onEdit(STEP.BUDGET)} />
        </div>
      </div>
      <WizardFooter
        onBack={onBack}
        onSaveDraft={onSaveDraft}
        onNext={handlePublish}
        nextDisabled={!canPublish}
        nextLabel="Publish"
        isNextLoading={isPending}
      />
    </div>
  )
}

export default ReviewStep
