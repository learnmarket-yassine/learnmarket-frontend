import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Conversation } from '../store/types'
import ToastMessage from '@/components/layout/ToastMessage'

const createConversation = async (
  axiosPrivate: AxiosInstance,
  counterpartId: string
): Promise<Conversation> => {
  const response = await axiosPrivate.post('/conversations', { counterpartId })
  return response.data
}

const useCreateConversation = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (counterpartId: string) => createConversation(axiosPrivate, counterpartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Failed to start the conversation. Please try again.',
      })
    },
  })
}

export default useCreateConversation
