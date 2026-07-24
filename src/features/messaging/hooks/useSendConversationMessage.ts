import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Message } from '../store/types'

type SendConversationMessagePayload = {
  conversationId: string
  content: string
}

const sendConversationMessage = async (
  axiosPrivate: AxiosInstance,
  { conversationId, content }: SendConversationMessagePayload
): Promise<Message> => {
  const response = await axiosPrivate.post(`/conversations/${conversationId}/messages`, {
    content,
  })
  return response.data
}

// REST fallback send -- used outside an open thread (e.g. a one-off
// "message this tutor" popup) where there's no socket room to emit into.
// Hits the same backend service method as the socket path, so there's no
// divergent validation between the two.
const useSendConversationMessage = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendConversationMessagePayload) =>
      sendConversationMessage(axiosPrivate, payload),
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    },
  })
}

export default useSendConversationMessage
