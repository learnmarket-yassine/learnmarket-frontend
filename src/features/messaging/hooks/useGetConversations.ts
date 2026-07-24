import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Conversation } from '../store/types'
import { useStore } from '@/store/store'

const getConversations = async (axiosPrivate: AxiosInstance): Promise<Conversation[]> => {
  const response = await axiosPrivate.get('/conversations')
  return response.data
}

const useGetConversations = () => {
  const axiosPrivate = useAxiosPrivate()
  const socket = useStore((state) => state.messaging.socket)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['conversations'] })
    socket.on('message:new', invalidate)
    socket.on('message:read', invalidate)
    socket.on('conversation:status_changed', invalidate)
    return () => {
      socket.off('message:new', invalidate)
      socket.off('message:read', invalidate)
      socket.off('conversation:status_changed', invalidate)
    }
  }, [socket, queryClient])

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations(axiosPrivate),
  })
}

export default useGetConversations
