import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { BookingStatus, SessionStatus } from '../../scheduling/types/enums'

export interface SessionContext {
  id: string
  title: string
  objective: string | null
  status: SessionStatus
  isTutor: boolean
  tutor: { firstname: string; lastname: string }
  tutorJoinedAt: string | null
  learnerJoinedAt: string | null
  summary: string | null
  summarySubmittedAt: string | null
  learnerConfirmedAt: string | null
  disputeReason: string | null
  disputedAt: string | null
  booking: { id: string; status: BookingStatus; startTime: string; endTime: string } | null
}

const getSessionContext = async (
  api: AxiosInstance,
  sessionId: string
): Promise<SessionContext> => {
  const response = await api.get(`/sessions/${sessionId}`)
  return response.data
}

export default function useGetSessionContext(sessionId: string, enabled = true) {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['session', sessionId, 'context'],
    queryFn: () => getSessionContext(axiosPrivate, sessionId),
    enabled: !!sessionId && enabled,
  })
}
