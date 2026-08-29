export type CountdownUrgency = 'normal' | 'warning' | 'critical'

export function formatCountdownShort(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

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

export function getCountdownUrgency(msRemaining: number, totalMs: number): CountdownUrgency {
  if (msRemaining <= 0) return 'critical'
  const ratio = totalMs > 0 ? msRemaining / totalMs : 0
  if (ratio <= 0.2) return 'critical'
  if (ratio <= 0.5) return 'warning'
  return 'normal'
}
