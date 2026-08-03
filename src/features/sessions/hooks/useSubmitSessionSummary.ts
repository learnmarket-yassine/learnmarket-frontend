import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

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
    },
  })

  return {
    handleSubmitSummary: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
