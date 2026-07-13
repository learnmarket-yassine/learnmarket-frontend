const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export function minutesToTimeString(minutes: number): string {
  const clamped = ((minutes % 1440) + 1440) % 1440
  const hours = Math.floor(clamped / 60)
  const mins = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function timeStringToMinutes(time: string): number {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time)
  if (!match) throw new Error(`Invalid time string: ${time}`)
  return Number(match[1]) * 60 + Number(match[2])
}

export function formatTimeRange(startMinutes: number, endMinutes: number): string {
  return `${minutesToTimeString(startMinutes)} – ${minutesToTimeString(endMinutes)}`
}

export function dayLabel(dayOfWeek: number): string {
  return DAY_LABELS[dayOfWeek]
}

export function formatSlotTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(iso))
}

export function formatDateLabel(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date(iso))
}
