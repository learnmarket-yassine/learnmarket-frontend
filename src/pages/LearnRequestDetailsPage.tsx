import ChevronStepper from '@/features/learn-requests/components/ui/ChevronStepper'
import LearnRequestDetailsStep from '@/features/learn-requests/components/ui/LearnRequestDetailsStep'
import useGetLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import { STATUS_LABELS } from '@/features/learn-requests/constants/labels'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LearnRequestProposalStep from '@/features/learn-requests/components/ui/LearnRequestProposalStep'
import CancelEngagementAction from '@/features/payments/components/CancelEngagementAction'
import LeaveFeedbackButton from '@/features/feedback/components/ui/LeaveFeedbackButton'
import { useStore } from '@/store/store'
import BookingFlow from '@/features/scheduling/components/ui/BookingFlow'

const LearnRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useGetLearnRequest(id)
  const [selected, setSelected] = useState(1)
  const acceptedProposal = data?.proposals?.find((proposal) => proposal.status === 'ACCEPTED')
  const currentUserId = useStore((state) => state.auth.user?.id)
  const isCompleted = data?.status === 'COMPLETED'
  const steps = [
    {
      stepNumber: 1,
      component: <LearnRequestDetailsStep id={id as string} />,
      show: true,
      name: 'view Learn Post',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: data ? (
        <LearnRequestProposalStep learnRequestId={id as string} status={data.status} />
      ) : null,
      show: true,
      name: 'Review proposals',
      enabled: true,
    },
    {
      stepNumber: 3,
      component: acceptedProposal ? <BookingFlow proposalId={acceptedProposal.id} /> : null,
      show: true,
      name: 'Plannification',
      enabled: !!acceptedProposal,
    },
    {
      stepNumber: 4,
      component: acceptedProposal ? <h1>test</h1> : null,
      show: true,
      name: 'Sessions',
      enabled: !!acceptedProposal,
    },
  ]
  const visibleSteps = steps.filter((step) => step.show)
  const currentStep = visibleSteps.find((step) => step.stepNumber === selected)

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex items-center justify-between">
        {data ? (
          <>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <div className="flex items-center gap-3">
              {acceptedProposal && isCompleted && currentUserId && (
                <LeaveFeedbackButton
                  proposalId={acceptedProposal.id}
                  currentUserId={currentUserId}
                  counterpartId={acceptedProposal.tutor.id}
                  counterpartName={`${acceptedProposal.tutor.firstname} ${acceptedProposal.tutor.lastname}`}
                />
              )}
              {data.status === 'CLOSED' && acceptedProposal && (
                <CancelEngagementAction
                  learnRequestId={id as string}
                  proposalId={acceptedProposal.id}
                />
              )}
              <span className="rounded-md border bg-[#143681] px-4 py-1 text-sm text-white">
                {STATUS_LABELS[data.status]}
              </span>
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </>
        )}
      </div>
      <div className="w-full space-y-2">
        <ChevronStepper selected={selected} setSelected={setSelected} steps={steps} />
      </div>
      {currentStep?.component || null}
    </div>
  )
}

export default LearnRequestDetailsPage
