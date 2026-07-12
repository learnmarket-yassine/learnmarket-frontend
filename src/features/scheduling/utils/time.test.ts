import { describe, expect, it } from 'vitest'
import { dayLabel, formatTimeRange, minutesToTimeString, timeStringToMinutes } from './time'

describe('minutesToTimeString', () => {
  it('formats midnight', () => {
    expect(minutesToTimeString(0)).toBe('00:00')
  })

  it('pads single-digit hours and minutes', () => {
    expect(minutesToTimeString(65)).toBe('01:05')
  })

  it('formats the last minute of the day', () => {
    expect(minutesToTimeString(1439)).toBe('23:59')
  })
})

describe('timeStringToMinutes', () => {
  it('parses HH:mm', () => {
    expect(timeStringToMinutes('09:30')).toBe(570)
  })

  it('round-trips with minutesToTimeString', () => {
    expect(timeStringToMinutes(minutesToTimeString(725))).toBe(725)
  })

  it('throws on malformed input', () => {
    expect(() => timeStringToMinutes('9:3')).toThrow()
    expect(() => timeStringToMinutes('24:00')).toThrow()
  })
})

describe('formatTimeRange', () => {
  it('joins start and end as HH:mm – HH:mm', () => {
    expect(formatTimeRange(540, 600)).toBe('09:00 – 10:00')
  })
})

describe('dayLabel', () => {
  it('maps 0 to Sun and 6 to Sat, matching Date.getDay()', () => {
    expect(dayLabel(0)).toBe('Sun')
    expect(dayLabel(6)).toBe('Sat')
  })
})
