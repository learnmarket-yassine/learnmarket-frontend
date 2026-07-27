import { addDays, format } from 'date-fns'
import { AvailabilityException, AvailabilityRule, TutorBooking } from '../types/dto'

export const minutesToTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00`

interface RuleRange {
  daysOfWeek: number[]
  startTime: string
  endTime: string
}

const ruleToRange = (rule: AvailabilityRule): RuleRange => ({
  daysOfWeek: [rule.dayOfWeek],
  startTime: minutesToTime(rule.startTime),
  endTime: minutesToTime(rule.endTime),
})

export const computeBusinessHours = (rules: AvailabilityRule[]): RuleRange[] =>
  rules.filter((rule) => rule.isActive).map(ruleToRange)

export const exceptionEventClassName = (exception: AvailabilityException) =>
  exception.type === 'BLOCKED' ? 'date-overrides-event-blocked' : 'date-overrides-event-added'

export const exceptionToEvent = (exception: AvailabilityException) => {
  const dateKey = exception.date.slice(0, 10)
  const hasCustomRange = exception.startTime !== null && exception.endTime !== null
  const classNames = [exceptionEventClassName(exception)]

  if (hasCustomRange) {
    return {
      id: exception.id,
      start: `${dateKey}T${minutesToTime(exception.startTime as number)}`,
      end: `${dateKey}T${minutesToTime(exception.endTime as number)}`,
      allDay: false,
      classNames,
      extendedProps: { exception },
    }
  }

  const nextDateKey = format(addDays(new Date(`${dateKey}T00:00:00`), 1), 'yyyy-MM-dd')
  return {
    id: exception.id,
    start: `${dateKey}T00:00:00`,
    end: `${nextDateKey}T00:00:00`,
    allDay: false,
    classNames,
    extendedProps: { exception },
  }
}

export const bookingToEvent = (booking: TutorBooking) => {
  const learnerName = `${booking.learner.firstname} ${booking.learner.lastname}`.trim()
  return {
    id: `booking-${booking.id}`,
    start: booking.startTime,
    end: booking.endTime,
    allDay: false,
    classNames: ['date-overrides-event-booked'],
    editable: false,
    extendedProps: { booking, learnerName },
  }
}

/** Rounds a clicked grid time to the nearest 30 minutes, clamped to the last slot of the day. */
export const roundToNearest30 = (date: Date): number => {
  const totalMinutes = date.getHours() * 60 + date.getMinutes()
  return Math.min(1410, Math.round(totalMinutes / 30) * 30)
}
