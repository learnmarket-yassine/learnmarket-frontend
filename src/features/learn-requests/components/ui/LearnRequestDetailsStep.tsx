import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetLearnRequest from '../../hooks/useGetLearnRequest'
import LearnRequestDetailsContent from './LearnRequestDetailsContent'
import LearnRequestSidebarStats from './LearnRequestSidebarStats'
import LearnRequestActionBar from './LearnRequestActionBar'

type Props = {
  id: string
}

const LearnRequestDetailsSkeleton = () => (
  <div className="grid grid-cols-1 gap-10 divide-x-[0.5px] divide-[#E0E2E6] lg:grid-cols-[1fr_320px]">
    <section className="space-y-8 p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </section>
    <aside className="space-y-3 p-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </aside>
  </div>
)

const LearnRequestDetailsStep = ({ id }: Props) => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetLearnRequest(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="divide-y-[0.5px] divide-[#E0E2E6]">
          <LearnRequestDetailsSkeleton />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={AlertCircle}
        message="This request couldn't be loaded. It may not exist, or you may not have access to it."
        ctaLabel="Back to your requests"
        onCta={() => navigate('/learning-requests')}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="divide-y-[0.5px] divide-[#E0E2E6]">
        <div className="flex items-center pb-2 text-sm text-gray-500">
          <span>Posted {new Date(data.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-1 gap-10 divide-x-[0.5px] divide-[#E0E2E6] lg:grid-cols-[1fr_320px]">
          <LearnRequestDetailsContent request={data} />
          <LearnRequestSidebarStats />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        <LearnRequestActionBar request={data} />
      </div>
    </div>
  )
}

export default LearnRequestDetailsStep
