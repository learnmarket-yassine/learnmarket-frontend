import { authSlice } from '@/features/auth/store/authSlice'
import { AuthSlice } from '@/features/auth/store/types'
import { messagingSlice } from '@/features/messaging/store/messagingSlice'
import { MessagingSlice } from '@/features/messaging/store/types'
import { myProfileSlice } from '@/features/myProfile/store/myProfileSlice'
import { MyProfileSlice } from '@/features/myProfile/store/types'
import { onBoardingSlice } from '@/features/onboarding/store/OnboardingSlice'
import { OnBoardingSlice } from '@/features/onboarding/store/types'
import { sessionsSlice } from '@/features/sessions/store/sessionsSlice'
import { SessionsSlice } from '@/features/sessions/store/types'
import { create } from 'zustand'

export const useStore = create<
  AuthSlice & MyProfileSlice & OnBoardingSlice & MessagingSlice & SessionsSlice
>()((...a) => ({
  ...authSlice(...a),
  ...myProfileSlice(...a),
  ...onBoardingSlice(...a),
  ...messagingSlice(...a),
  ...sessionsSlice(...a),
}))
