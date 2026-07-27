import { StateCreator } from 'zustand'
import { SessionsSlice } from './types'

export const sessionsSlice: StateCreator<SessionsSlice> = (set) => ({
  sessionsSocket: {
    socket: null,
    setSocket: (socket) =>
      set((state) => ({
        sessionsSocket: {
          ...state.sessionsSocket,
          socket,
        },
      })),
  },
})
