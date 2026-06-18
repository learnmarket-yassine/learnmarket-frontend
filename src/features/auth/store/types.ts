type Auth = {
  AccessToken: string
  ExpiresIn: number
}

type AuthState = {
  authenticationResult: Auth | null
  setAuthenticationResult: (auth: Auth | null) => void
}
export type AuthSlice = {
  auth: AuthState
}
