import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CreateLearnRequestLayout from '@/features/learn-requests/components/layout/CreateLearnRequestLayout'
import AddLearnRequestForm from '@/features/learn-requests/components/layout/AddLearnRequestForm'
import useLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import { INITIAL_WIZARD_STATE } from '@/features/learn-requests/store/types'
import { mapLearnRequestToWizardState } from '@/features/learn-requests/validation'

const CreateLearnRequestPage = () => {
  const { id: routeDraftId } = useParams<{ id: string }>()
  const [initialDraftId] = useState(routeDraftId ?? null)

  const {
    data: learnRequestData,
    isLoading: isLearnRequestLoading,
    isError,
  } = useLearnRequest(initialDraftId ?? undefined)

  if (initialDraftId && isLearnRequestLoading) {
    return (
      <CreateLearnRequestLayout>
        <div className="container flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-sm text-[#6B7280]">Loading your request…</p>
        </div>
      </CreateLearnRequestLayout>
    )
  }
  if (initialDraftId && isError) {
    return (
      <CreateLearnRequestLayout>
        <div className="container flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-sm text-[#6B7280]">Error</p>
        </div>
      </CreateLearnRequestLayout>
    )
  }

  const initialWizardState = learnRequestData
    ? mapLearnRequestToWizardState(learnRequestData)
    : INITIAL_WIZARD_STATE

  return (
    <CreateLearnRequestLayout>
      <AddLearnRequestForm
        initialDraftId={initialDraftId}
        initialFormStep={initialDraftId ? 1 : 0}
        initialWizardState={initialWizardState}
      />
    </CreateLearnRequestLayout>
  )
}

export default CreateLearnRequestPage
