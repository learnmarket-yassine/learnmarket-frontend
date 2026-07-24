import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Message } from '../store/types'
import { useStore } from '@/store/store'

export const MESSAGES_PAGE_SIZE = 30

export interface GetMessagesResponse {
  paginatedResult: Message[]
  totalCount: number
}

const getMessages = async (
  axiosPrivate: AxiosInstance,
  conversationId: string,
  page: number
): Promise<GetMessagesResponse> => {
  const response = await axiosPrivate.get(
    `/conversations/${conversationId}/messages?page=${page}&take=${MESSAGES_PAGE_SIZE}`
  )
  return response.data
}

const useGetMessages = (conversationId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()
  const socket = useStore((state) => state.messaging.socket)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket || !conversationId) return

    const joinRoom = () => socket.emit('conversation:join', { conversationId })
    joinRoom()
    socket.on('connect', joinRoom)

    const handleNew = (message: Message) => {
      if (message.conversationId !== conversationId) return
      queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
        ['messages', conversationId],
        (old) => {
          if (!old) return old
          const alreadyPresent = old.pages[0].paginatedResult.some((m) => m.id === message.id)
          if (alreadyPresent) return old
          return {
            ...old,
            pages: [
              { ...old.pages[0], paginatedResult: [message, ...old.pages[0].paginatedResult] },
              ...old.pages.slice(1),
            ],
          }
        }
      )
    }

    const handleRead = ({ readBy }: { conversationId: string; readBy: string }) => {
      queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
        ['messages', conversationId],
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              paginatedResult: p.paginatedResult.map((m) =>
                m.senderId === readBy ? m : { ...m, status: 'READ' as const }
              ),
            })),
          }
        }
      )
    }

    socket.on('message:new', handleNew)
    socket.on('message:read', handleRead)
    return () => {
      socket.emit('conversation:leave', { conversationId })
      socket.off('connect', joinRoom)
      socket.off('message:new', handleNew)
      socket.off('message:read', handleRead)
    }
  }, [socket, conversationId, queryClient])

  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam }) => getMessages(axiosPrivate, conversationId as string, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length * MESSAGES_PAGE_SIZE < lastPage.totalCount ? pages.length : undefined,
    enabled: !!conversationId,
  })
}

export default useGetMessages
