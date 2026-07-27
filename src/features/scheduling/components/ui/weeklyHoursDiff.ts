import { WeeklyHoursFormValues } from '../../schemas'
import type {
  AvailabilityRule,
  CreateAvailabilityRuleInput,
  UpdateAvailabilityRuleInput,
} from '../../types/dto'

export interface WeeklyHoursMutations {
  toCreate: CreateAvailabilityRuleInput[]
  toUpdate: { id: string; input: UpdateAvailabilityRuleInput }[]
  toDelete: string[]
}

export function buildWeeklyHoursDefaultValues(rules: AvailabilityRule[]): WeeklyHoursFormValues {
  return {
    days: Array.from({ length: 7 }, (_, dayOfWeek) => {
      const slots = rules
        .filter((rule) => rule.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.startTime - b.startTime)
        .map((rule) => ({ id: rule.id, start: rule.startTime, end: rule.endTime }))
      return { dayOfWeek, enabled: slots.length > 0, slots }
    }),
  }
}

/** Reconciles the Weekly Hours form against the tutor's persisted rules into create/update/delete ops. */
export function diffWeeklyHours(
  original: AvailabilityRule[],
  form: WeeklyHoursFormValues,
  timezone: string
): WeeklyHoursMutations {
  const toCreate: CreateAvailabilityRuleInput[] = []
  const toUpdate: { id: string; input: UpdateAvailabilityRuleInput }[] = []
  const toDelete: string[] = []

  for (const day of form.days) {
    const originalForDay = original.filter((rule) => rule.dayOfWeek === day.dayOfWeek)

    if (!day.enabled) {
      toDelete.push(...originalForDay.map((rule) => rule.id))
      continue
    }

    const keptIds = new Set(day.slots.map((slot) => slot.id).filter(Boolean))
    for (const rule of originalForDay) {
      if (!keptIds.has(rule.id)) toDelete.push(rule.id)
    }

    for (const slot of day.slots) {
      if (!slot.id) {
        toCreate.push({
          dayOfWeek: day.dayOfWeek,
          startTime: slot.start,
          endTime: slot.end,
          timezone,
        })
        continue
      }
      const existing = originalForDay.find((rule) => rule.id === slot.id)
      if (!existing) continue
      if (
        existing.startTime !== slot.start ||
        existing.endTime !== slot.end ||
        existing.timezone !== timezone
      ) {
        toUpdate.push({
          id: slot.id,
          input: { startTime: slot.start, endTime: slot.end, timezone },
        })
      }
    }
  }

  return { toCreate, toUpdate, toDelete }
}
