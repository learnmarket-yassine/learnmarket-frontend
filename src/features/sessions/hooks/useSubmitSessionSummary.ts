import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import ToastMessage from '@/components/layout/ToastMessage'

const submitSessionSummary = async (
  api: AxiosInstance,
  sessionId: string,
  summary: string
): Promise<void> => {
  await api.post(`/sessions/${sessionId}/summary`, { summary })
}

export default function useSubmitSessionSummary(sessionId: string) {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (summary: string) => submitSessionSummary(axiosPrivate, sessionId, summary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'context'] })
      ToastMessage({ type: 'success', message: 'Session summary submitted.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to submit session summary. Please try again.',
      })
    },
  })

  return {
    handleSubmitSummary: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
