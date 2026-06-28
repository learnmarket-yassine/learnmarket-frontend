import { StateCreator } from 'zustand'
import { MyProfileSlice } from './types'

export const myProfileSlice: StateCreator<MyProfileSlice> = (set) => ({
  myProfile: {
    tutorProfile: null,
    setTutorProfile: (profile) =>
      set((state) => ({
        myProfile: {
          ...state.myProfile,
          tutorProfile: profile,
        },
      })),
  },
})
