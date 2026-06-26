type Auth = {
  token: string
}

type Role = 'TUTOR' | 'LEARNER'

type AuthState = {
  authenticationResult: Auth | null
  setAuthenticationResult: (auth: Auth | null) => void
  role: Role | null
  setRole: (role: Role) => void
}
export type AuthSlice = {
  auth: AuthState
}
