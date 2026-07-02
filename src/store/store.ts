import { authSlice } from '@/features/auth/store/authSlice'
import { AuthSlice } from '@/features/auth/store/types'
import { myProfileSlice } from '@/features/myProfile/store/myProfileSlice'
import { MyProfileSlice } from '@/features/myProfile/store/types'
import { create } from 'zustand'

export const useStore = create<AuthSlice & MyProfileSlice>()((...a) => ({
  ...authSlice(...a),
  ...myProfileSlice(...a),
}))
