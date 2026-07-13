import { useEffect, useState } from 'react'
import { formatCountdown, getCountdownUrgency, type CountdownUrgency } from '../utils/countdown'

export interface CountdownState {
  msRemaining: number
  formatted: string
  urgency: CountdownUrgency
  isExpired: boolean
}

function msUntil(expiresAt: string): number {
  return Math.max(0, new Date(expiresAt).getTime() - Date.now())
}

export function useCountdown(expiresAt: string | null): CountdownState {
  const [, forceTick] = useState(0)
  const [trackedExpiresAt, setTrackedExpiresAt] = useState(expiresAt)
  const [totalMs, setTotalMs] = useState(() => (expiresAt ? msUntil(expiresAt) : 0))
  if (expiresAt !== trackedExpiresAt) {
    setTrackedExpiresAt(expiresAt)
    setTotalMs(expiresAt ? msUntil(expiresAt) : 0)
  }

  useEffect(() => {
    if (!expiresAt) return
    const interval = setInterval(() => forceTick((tick) => tick + 1), 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const msRemaining = expiresAt ? msUntil(expiresAt) : 0

  return {
    msRemaining,
    formatted: formatCountdown(msRemaining),
    urgency: getCountdownUrgency(msRemaining, totalMs),
    isExpired: expiresAt !== null && msRemaining <= 0,
  }
}
