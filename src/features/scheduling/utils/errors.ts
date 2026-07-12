import { AxiosError } from 'axios'
import type { AvailabilityConflictPayload } from '../types/dto'

function hasAffectedSessions(data: unknown): data is AvailabilityConflictPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as Record<string, unknown>).affectedSessions)
  )
}

/** Rule/exception writes 409 with `{ message, affectedSessions }` when they'd strand a confirmed booking. */
export function getAvailabilityConflict(error: unknown): AvailabilityConflictPayload | null {
  if (!(error instanceof AxiosError)) return null
  if (error.response?.status !== 409) return null
  return hasAffectedSessions(error.response.data) ? error.response.data : null
}

/** POST /holds/:id/confirm returns 410 once the 10-minute hold has expired. */
export function isHoldExpiredError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 410
}

/** POST /holds or /holds/:id/confirm returns 409 (no affectedSessions payload) when the slot was just taken. */
export function isSlotTakenError(error: unknown): boolean {
  return (
    error instanceof AxiosError && error.response?.status === 409 && !getAvailabilityConflict(error)
  )
}
