import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { MeetingDetails } from '../../scheduling/types/dto'
import ToastMessage from '@/components/layout/ToastMessage'

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
      ToastMessage({ type: 'success', message: 'Meeting link regenerated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to retry the meeting. Please try again.' })
    },
  })

  return {
    handleRetryMeeting: retryMeetingMutation.mutateAsync,
    isPending: retryMeetingMutation.isPending,
    isError: retryMeetingMutation.isError,
  }
}
