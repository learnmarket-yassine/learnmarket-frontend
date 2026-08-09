import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { LearnRequest, UpdateLearnRequestPayload } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

type Variables = { id: string; payload: UpdateLearnRequestPayload }

const useUpdateLearnRequest = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: Variables): Promise<LearnRequest> => {
      const response = await axiosPrivate.patch(`/learn-requests/${id}`, payload)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learnRequest', data.id] })
      queryClient.invalidateQueries({ queryKey: ['myLearnRequests'] })
      ToastMessage({ type: 'success', message: 'Learning request updated.' })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to update the learning request. Please try again.',
      })
    },
  })
}

export default useUpdateLearnRequest
