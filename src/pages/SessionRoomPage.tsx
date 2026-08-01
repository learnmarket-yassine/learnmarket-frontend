import { useParams } from 'react-router-dom'
import SessionRoom from '@/features/sessions/components/SessionRoom'

const SessionRoomPage = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) return null

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold text-[#1E293B]">Session Room</h1>
      <SessionRoom sessionId={id} />
    </div>
  )
}

export default SessionRoomPage
