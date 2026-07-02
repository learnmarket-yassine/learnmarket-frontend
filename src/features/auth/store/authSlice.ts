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
    user: null,
    setUser: (user) =>
      set((state) => ({
        auth: {
          ...state.auth,
          user: user,
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
    currentStep: 1,
    setCurrentStep: (step) =>
      set((state) => ({
        auth: {
          ...state.auth,
          currentStep: step,
        },
      })),
  },
})
