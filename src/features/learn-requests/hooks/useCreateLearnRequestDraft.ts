import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { CreateLearnRequestDraftPayload, LearnRequest } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreateLearnRequestDraft = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateLearnRequestDraftPayload): Promise<LearnRequest> => {
      const response = await axiosPrivate.post('/learn-requests/draft', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLearnRequests'] })
      ToastMessage({ type: 'success', message: 'Draft saved.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to save the draft. Please try again.' })
    },
  })
}

export default useCreateLearnRequestDraft
