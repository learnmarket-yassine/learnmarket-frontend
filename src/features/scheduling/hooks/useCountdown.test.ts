import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-12T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down toward zero and escalates urgency', () => {
    const expiresAt = new Date('2026-07-12T10:10:00.000Z').toISOString()
    const { result } = renderHook(() => useCountdown(expiresAt))

    expect(result.current.formatted).toBe('10:00')
    expect(result.current.urgency).toBe('normal')
    expect(result.current.isExpired).toBe(false)

    act(() => {
      vi.advanceTimersByTime(8 * 60_000)
    })
    expect(result.current.formatted).toBe('2:00')
    expect(result.current.urgency).toBe('critical')
    expect(result.current.isExpired).toBe(false)

    act(() => {
      vi.advanceTimersByTime(2 * 60_000)
    })
    expect(result.current.msRemaining).toBe(0)
    expect(result.current.isExpired).toBe(true)
  })

  it('reports expired immediately for a hold that already expired', () => {
    const expiresAt = new Date('2026-07-12T09:59:00.000Z').toISOString()
    const { result } = renderHook(() => useCountdown(expiresAt))
    expect(result.current.isExpired).toBe(true)
  })

  it('is inert when there is no active hold', () => {
    const { result } = renderHook(() => useCountdown(null))
    expect(result.current.isExpired).toBe(false)
    expect(result.current.formatted).toBe('0:00')
  })
})
