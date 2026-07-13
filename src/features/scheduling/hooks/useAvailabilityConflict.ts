import { useCallback, useState } from 'react'
import { getAvailabilityConflict } from '../utils/errors'
import { AvailabilityConflictPayload } from '../types/dto'

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
