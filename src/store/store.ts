import { authSlice } from '@/features/auth/store/authSlice'
import { AuthSlice } from '@/features/auth/store/types'
import { create } from 'zustand'

export const useStore = create<AuthSlice>()((...a) => ({
  ...authSlice(...a),
}))
