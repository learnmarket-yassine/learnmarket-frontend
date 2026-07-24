import { StateCreator } from 'zustand'
import { MessagingSlice } from './types'

export const messagingSlice: StateCreator<MessagingSlice> = (set) => ({
  messaging: {
    socket: null,
    setSocket: (socket) =>
      set((state) => ({
        messaging: {
          ...state.messaging,
          socket,
        },
      })),
  },
})
