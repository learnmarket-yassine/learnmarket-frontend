import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { MeetingDetails } from '../../scheduling/types/dto'

const getMeetingDetails = async (
  api: AxiosInstance,
  sessionId: string
): Promise<MeetingDetails> => {
  const response = await api.get(`/sessions/${sessionId}/meeting`)
  return response.data
}

export default function useGetMeetingDetails(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['session', sessionId, 'meeting'],
    queryFn: () => getMeetingDetails(axiosPrivate, sessionId),
    enabled: !!sessionId,
  })
}
