import { StateCreator } from 'zustand'
import { OnBoardingSlice } from './types'

const initialState = {
  formStep: 1,
}
export const onBoardingSlice: StateCreator<OnBoardingSlice> = (set) => ({
  onBoarding: {
    ...initialState,
    setFormStep: (step) =>
      set((state) => ({
        onBoarding: {
          ...state.onBoarding,
          formStep: step,
        },
      })),
  },
})
