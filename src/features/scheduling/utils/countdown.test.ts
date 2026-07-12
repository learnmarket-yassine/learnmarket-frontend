import { describe, expect, it } from 'vitest'
import { formatCountdown, getCountdownUrgency } from './countdown'

describe('formatCountdown', () => {
  it('formats minutes and seconds', () => {
    expect(formatCountdown(9 * 60_000 + 45_000)).toBe('9:45')
  })

  it('pads seconds under 10', () => {
    expect(formatCountdown(65_000)).toBe('1:05')
  })

  it('floors to 0:00 once expired', () => {
    expect(formatCountdown(0)).toBe('0:00')
  })

  it('never returns negative', () => {
    expect(formatCountdown(-5000)).toBe('0:00')
  })
})

describe('getCountdownUrgency', () => {
  it('is normal above 50% remaining', () => {
    expect(getCountdownUrgency(8 * 60_000, 10 * 60_000)).toBe('normal')
  })

  it('is warning at or below 50% remaining', () => {
    expect(getCountdownUrgency(5 * 60_000, 10 * 60_000)).toBe('warning')
  })

  it('is critical at or below 20% remaining', () => {
    expect(getCountdownUrgency(2 * 60_000, 10 * 60_000)).toBe('critical')
  })

  it('is critical once expired', () => {
    expect(getCountdownUrgency(0, 10 * 60_000)).toBe('critical')
  })
})
