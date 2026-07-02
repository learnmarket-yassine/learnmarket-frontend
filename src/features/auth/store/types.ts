import { TutorProfile } from '@/features/myProfile/store/types'

type Auth = {
  token: string
}

type Role = 'TUTOR' | 'LEARNER'

type AuthUser = {
  id: string
  email: string
  firstname: string
  lastname: string
  avatar: string | null
  location: string | null
  phone: string | null
  role: Role
  isOnlineForMsg: boolean
  isProfileCompleted: boolean
  tutorProfile: TutorProfile | null
}

type AuthState = {
  authenticationResult: Auth | null
  setAuthenticationResult: (auth: Auth | null) => void
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  role: Role | null
  setRole: (role: Role | null) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}
export type AuthSlice = {
  auth: AuthState
}
