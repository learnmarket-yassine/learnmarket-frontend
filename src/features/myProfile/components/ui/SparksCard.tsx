import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import useGetSparksBalance from '@/features/sparks/hooks/useGetSparksBalance'

const SETTINGS_SPARKS_SECTION = 5

const SparksCard = () => {
  const { data: balance, isLoading } = useGetSparksBalance()

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#F5F6F7] p-5">
      <h3 className="flex items-center gap-2 text-xl font-bold text-[#143681]">
        <span>Sparks:</span>
        {isLoading ? <Skeleton className="h-6 w-10" /> : <span>{balance?.sparksBalance ?? 0}</span>}
      </h3>
      <div className="flex items-center justify-between text-[#143681]">
        <Link
          className="hover:underline"
          to="/settings"
          state={{ section: SETTINGS_SPARKS_SECTION }}
        >
          View Details
        </Link>
        <Link className="hover:underline" to={'/sparks/buy'}>
          Buy Sparks
        </Link>
      </div>
    </div>
  )
}

export default SparksCard
