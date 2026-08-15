import { StateCreator } from 'zustand'
import { NotificationsSlice } from './types'

export const notificationsSlice: StateCreator<NotificationsSlice> = (set) => ({
  notifications: {
    socket: null,
    setSocket: (socket) =>
      set((state) => ({
        notifications: {
          ...state.notifications,
          socket,
        },
      })),
  },
})
