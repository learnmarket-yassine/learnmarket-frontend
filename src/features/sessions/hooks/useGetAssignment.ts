import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { AssignmentResponse } from '../../scheduling/types/dto'

const getAssignment = async (
  api: AxiosInstance,
  sessionId: string
): Promise<AssignmentResponse> => {
  const response = await api.get(`/sessions/${sessionId}/assignment`)
  return response.data
}

export default function useGetAssignment(sessionId: string | null) {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['session', sessionId, 'assignment'],
    queryFn: () => getAssignment(axiosPrivate, sessionId as string),
    enabled: !!sessionId,
  })
}
