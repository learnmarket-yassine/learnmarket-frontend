import { Skeleton } from '@/components/ui/skeleton'
import useGetLearnRequestStats from '../../hooks/useGetLearnRequestStats'

const LearnRequestSidebarStats = () => {
  const { data, isLoading, isError } = useGetLearnRequestStats()

  return (
    <aside className="space-y-5 p-6">
      <h2 className="text-xl font-semibold text-[#143681]">About the learner</h2>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {isError && <p className="text-sm text-gray-400">Stats unavailable</p>}

      {data && (
        <div className="space-y-3 text-sm text-[#565a60]">
          <p>
            <span className="font-semibold text-[#143681]">{data.requestCount}</span> learning
            requests posted
          </p>
          <p>
            <span className="font-semibold text-[#143681]">{Math.round(data.hireRate)}%</span> hire
            rate
          </p>
        </div>
      )}
    </aside>
  )
}

export default LearnRequestSidebarStats
