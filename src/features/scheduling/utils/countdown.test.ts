import { describe, expect, it } from 'vitest'
import { formatCountdownLong, formatCountdownShort, getCountdownUrgency } from './countdown'

describe('formatCountdownShort', () => {
  it('formats as mm:ss', () => {
    expect(formatCountdownShort(10 * 60_000)).toBe('10:00')
  })

  it('pads seconds under 10', () => {
    expect(formatCountdownShort(65_000)).toBe('1:05')
  })

  it('floors to 0:00 once expired', () => {
    expect(formatCountdownShort(0)).toBe('0:00')
  })

  it('never returns negative', () => {
    expect(formatCountdownShort(-5000)).toBe('0:00')
  })
})

describe('formatCountdownLong', () => {
  it('formats minutes only under an hour', () => {
    expect(formatCountdownLong(9 * 60_000 + 45_000)).toBe('9 minutes')
  })

  it('uses singular units', () => {
    expect(formatCountdownLong(65_000)).toBe('1 minute')
  })

  it('rolls over into hours', () => {
    expect(formatCountdownLong(2 * 60 * 60_000 + 15 * 60_000)).toBe('2 hours, 15 minutes')
  })

  it('rolls over into days, hours, and minutes', () => {
    // 8170 minutes = 5 days, 16 hours, 10 minutes
    expect(formatCountdownLong(8170 * 60_000 + 4_000)).toBe('5 days, 16 hours, 10 minutes')
  })

  it('uses singular day/hour', () => {
    expect(formatCountdownLong(25 * 60 * 60_000 + 60_000)).toBe('1 day, 1 hour, 1 minute')
  })

  it('floors to 0 minutes once expired', () => {
    expect(formatCountdownLong(0)).toBe('0 minutes')
  })

  it('never returns negative', () => {
    expect(formatCountdownLong(-5000)).toBe('0 minutes')
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
