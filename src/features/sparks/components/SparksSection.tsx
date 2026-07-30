import { Link } from 'react-router-dom'
import useGetSparksBalance from '../hooks/useGetSparksBalance'
import SparksHistoryList from './ui/SparksHistoryList'

const SparksSection = () => {
  const { data: balance } = useGetSparksBalance()

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold">Sparks</h2>
          <p>
            Track your balance, send proposals to learners, and see exactly how you've earned and
            spent every Spark in one place.
          </p>
        </div>
        <div className="w-72 rounded-2xl bg-blue-900 text-white">
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-normal">Balance</span>
            <span className="text-4xl font-bold">{balance?.sparksBalance ?? '—'}</span>
            <Link to="/sparks/buy" className="font-semibold underline">
              Buy Sparks
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-3 rounded-xl border border-[#E0E2E6] p-5">
        <h3 className="text-2xl font-semibold text-blue-900">History</h3>
        <SparksHistoryList />
      </div>
    </div>
  )
}

export default SparksSection
