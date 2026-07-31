import { useParams } from 'react-router-dom'
import SessionRoomDetails from '@/features/sessions/components/ui/SessionRoomDetails'

const SessionDetailPage = () => {
  const { proposalId, sessionId } = useParams<{ proposalId: string; sessionId: string }>()
  if (!proposalId || !sessionId) return null

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E0E2E6] bg-white p-6">
      <SessionRoomDetails sessionId={sessionId} proposalId={proposalId} />
    </div>
  )
}

export default SessionDetailPage
