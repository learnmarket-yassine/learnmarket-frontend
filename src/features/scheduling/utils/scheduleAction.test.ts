import { describe, expect, it } from 'vitest'
import { getScheduleAction } from './scheduleAction'

describe('getScheduleAction', () => {
  it('disables LOCKED with a reason', () => {
    expect(getScheduleAction('LOCKED')).toEqual({
      enabled: false,
      label: 'Schedule',
      disabledReason: 'Complete the previous session first',
    })
  })

  it('enables PENDING_SCHEDULE as "Schedule"', () => {
    expect(getScheduleAction('PENDING_SCHEDULE')).toEqual({ enabled: true, label: 'Schedule' })
  })

  it('enables HELD as "Resume"', () => {
    expect(getScheduleAction('HELD')).toEqual({ enabled: true, label: 'Resume' })
  })

  it('enables BOOKED as "Reschedule"', () => {
    expect(getScheduleAction('BOOKED')).toEqual({ enabled: true, label: 'Reschedule' })
  })

  it('hides the action for PENDING_REVIEW', () => {
    expect(getScheduleAction('PENDING_REVIEW').enabled).toBeNull()
  })

  it('hides the action for COMPLETED', () => {
    expect(getScheduleAction('COMPLETED').enabled).toBeNull()
  })

  it('treats CANCELLED identically to PENDING_SCHEDULE', () => {
    expect(getScheduleAction('CANCELLED')).toEqual({ enabled: true, label: 'Schedule' })
  })
})
