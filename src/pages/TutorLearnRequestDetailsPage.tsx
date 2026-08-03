import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import useGetMyProposal from '@/features/proposal/hooks/useGetMyProposal'
import ProposalLearnRequestContextCard from '@/features/proposal/components/ui/ProposalLearnRequestContextCard'
import CoverLetterSection from '@/features/proposal/components/ui/ProposalCoverLetterSection'
import ProposalStatusBadge from '@/features/proposal/components/ui/ProposalStatusBadge'
import ChevronStepper from '@/features/learn-requests/components/ui/ChevronStepper'
import ViewFeedbackButton from '@/features/feedback/components/ui/ViewFeedbackButton'
import SessionsFlow from '@/features/sessions/components/ui/SessionsFlow'

const TutorLearnRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: proposal, isLoading, isError } = useGetMyProposal(id)
  const [selected, setSelected] = useState(1)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !id || !proposal) {
    return (
      <div className="space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">
          This learn request couldn't be found.
        </p>
        <Link
          to="/accueil"
          className="inline-block text-sm font-semibold text-[#2563EB] underline underline-offset-2"
        >
          Back to Accueil
        </Link>
      </div>
    )
  }

  const steps = [
    {
      stepNumber: 1,
      component: (
        <div className="flex flex-col space-y-6">
          <ProposalLearnRequestContextCard proposal={proposal} />
          {proposal.message && (
            <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
              <CoverLetterSection message={proposal.message} />
            </div>
          )}
        </div>
      ),
      show: true,
      name: 'Learn request details',
      enabled: true,
    },
    {
      stepNumber: 2,
      component: <SessionsFlow proposalId={id} />,
      show: true,
      name: 'Sessions',
      enabled: true,
    },
  ]
  const currentStep = steps.find((step) => step.stepNumber === selected)

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{proposal.learnRequest.title}</h1>
        <div className="flex items-center gap-3">
          {proposal.learnRequest.status === 'COMPLETED' && proposal.learnRequest.learner && (
            <ViewFeedbackButton
              proposalId={proposal.id}
              counterpartId={proposal.learnRequest.learner.id}
              counterpartName={`${proposal.learnRequest.learner.firstname} ${proposal.learnRequest.learner.lastname}`}
            />
          )}
          <ProposalStatusBadge status={proposal.status} />
        </div>
      </div>
      <div className="w-full space-y-2">
        <ChevronStepper selected={selected} setSelected={setSelected} steps={steps} />
      </div>
      {currentStep?.component || null}
    </div>
  )
}

export default TutorLearnRequestDetailsPage
