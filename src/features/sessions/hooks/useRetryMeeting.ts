import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { MeetingDetails } from '../../scheduling/types/dto'

const retryMeeting = async (api: AxiosInstance, sessionId: string): Promise<MeetingDetails> => {
  const response = await api.post(`/sessions/${sessionId}/meeting/retry`)
  return response.data
}

export default function useRetryMeeting(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const retryMeetingMutation = useMutation({
    mutationFn: () => retryMeeting(axiosPrivate, sessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(['session', sessionId, 'meeting'], data)
    },
  })

  return {
    handleRetryMeeting: retryMeetingMutation.mutateAsync,
    isPending: retryMeetingMutation.isPending,
    isError: retryMeetingMutation.isError,
  }
}
