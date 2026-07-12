import { useCallback, useState } from 'react'
import type { AvailabilityConflictPayload } from '../../types/dto'
import { getAvailabilityConflict } from '../../utils/errors'

/**
 * Rule/exception writes 409 whenever they'd strand a confirmed booking.
 * `handleError` returns true when it recognized and captured that shape,
 * so callers know not to also show a generic error toast.
 */
export function useAvailabilityConflict() {
  const [conflict, setConflict] = useState<AvailabilityConflictPayload | null>(null)

  const handleError = useCallback((error: unknown): boolean => {
    const payload = getAvailabilityConflict(error)
    if (payload) {
      setConflict(payload)
      return true
    }
    return false
  }, [])

  const dismiss = useCallback(() => setConflict(null), [])

  return { conflict, handleError, dismiss }
}
