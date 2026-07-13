export type CountdownUrgency = 'normal' | 'warning' | 'critical'

export function formatCountdown(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/** `totalMs` is the duration remaining at the moment the countdown started, used as the ratio baseline. */
export function getCountdownUrgency(msRemaining: number, totalMs: number): CountdownUrgency {
  if (msRemaining <= 0) return 'critical'
  const ratio = totalMs > 0 ? msRemaining / totalMs : 0
  if (ratio <= 0.2) return 'critical'
  if (ratio <= 0.5) return 'warning'
  return 'normal'
}
