import { AxiosError } from 'axios'

/** POST /proposals returns 409 with a message mentioning "Sparks" when the tutor's balance is too low. */
export function isInsufficientSparksError(error: unknown): boolean {
  if (!(error instanceof AxiosError) || error.response?.status !== 409) return false
  const message = error.response?.data?.message
  return typeof message === 'string' && message.includes('Sparks')
}
