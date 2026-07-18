import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { CreateLearnRequestDraftPayload, LearnRequest } from '../store/types'

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
    },
  })
}

export default useCreateLearnRequestDraft
