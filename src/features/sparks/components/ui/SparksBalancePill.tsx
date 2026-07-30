import { Coins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import useGetSparksBalance from '../../hooks/useGetSparksBalance'

const SparksBalancePill = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useGetSparksBalance()

  if (isLoading || !data) return null

  return (
    <Badge
      variant="secondary"
      className="h-8 cursor-pointer gap-1.5 rounded-lg border-none bg-[#F5F6F7] px-3 py-1 text-xs text-[#102A63]"
      onClick={() => navigate('/settings', { state: { section: 5 } })}
    >
      <Coins className="size-3.5" aria-hidden="true" />
      {data.sparksBalance} Sparks
    </Badge>
  )
}

export default SparksBalancePill
