import { Skeleton } from '@/components/ui/skeleton'
import useGetLearnRequest from '@/features/learn-requests/hooks/useGetLearnRequest'
import CreateProposalForm from '@/features/proposal/components/ui/CreateProposalForm/CreateProposalForm'

import { useParams } from 'react-router-dom'

const CreateProposalPage = () => {
  const params = useParams()
  const { data, isLoading, isError } = useGetLearnRequest(params.id)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">
          This learning request couldn't be found.
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">
          It may have been removed, or the link is incorrect.
        </p>
      </div>
    )
  }

  return (
    <div>
      <CreateProposalForm learnrequest={data} />
    </div>
  )
}

export default CreateProposalPage
