export type CountdownUrgency = 'normal' | 'warning' | 'critical'

// Short mm:ss form -- used for tight, seconds-precision countdowns like an
// active slot hold (a handful of minutes, ticking down live).
export function formatCountdownShort(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Long day/hour/minute breakdown -- used for far-out countdowns like the
// time until a scheduled session starts, where seconds precision is noise
// and raw minutes (e.g. "8170:04") is unreadable.
export function formatCountdownLong(msRemaining: number): string {
  const totalMinutes = Math.max(0, Math.floor(msRemaining / 60_000))
  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`)
  if (days > 0 || hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
  parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
  return parts.join(', ')
}

/** `totalMs` is the duration remaining at the moment the countdown started, used as the ratio baseline. */
export function getCountdownUrgency(msRemaining: number, totalMs: number): CountdownUrgency {
  if (msRemaining <= 0) return 'critical'
  const ratio = totalMs > 0 ? msRemaining / totalMs : 0
  if (ratio <= 0.2) return 'critical'
  if (ratio <= 0.5) return 'warning'
  return 'normal'
}
