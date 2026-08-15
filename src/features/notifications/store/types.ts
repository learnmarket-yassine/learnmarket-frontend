import { Socket } from 'socket.io-client'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export interface GetNotificationsResponse {
  data: Notification[]
  total: number
  page: number
  hasMore: boolean
}

type NotificationsState = {
  socket: Socket | null
  setSocket: (socket: Socket | null) => void
}
export type NotificationsSlice = {
  notifications: NotificationsState
}
