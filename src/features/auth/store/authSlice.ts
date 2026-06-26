import { StateCreator } from 'zustand'
import { AuthSlice } from './types'

export const authSlice: StateCreator<AuthSlice> = (set) => ({
  auth: {
    authenticationResult: null,
    setAuthenticationResult: (auth) =>
      set((state) => ({
        auth: {
          ...state.auth,
          authenticationResult: auth,
        },
      })),
    role: null,
    setRole: (role) =>
      set((state) => ({
        auth: {
          ...state.auth,
          role: role,
        },
      })),
  },
})
