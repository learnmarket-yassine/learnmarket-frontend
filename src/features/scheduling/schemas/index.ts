import { z } from 'zod'

export const timeSlotSchema = z
  .object({
    id: z.string().optional(),
    start: z.number().min(0).max(1440),
    end: z.number().min(0).max(1440),
  })
  .refine((slot) => slot.end > slot.start, {
    message: 'End time must be after start time',
    path: ['end'],
  })

export const weeklyDaySchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    enabled: z.boolean(),
    slots: z.array(timeSlotSchema),
  })
  .superRefine((day, ctx) => {
    if (!day.enabled || day.slots.length < 2) return
    const withIndex = day.slots.map((slot, index) => ({ ...slot, index }))
    const sorted = [...withIndex].sort((a, b) => a.start - b.start)
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start < sorted[i - 1].end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Overlaps with another time slot',
          path: ['slots', sorted[i].index, 'start'],
        })
      }
    }
  })

export const weeklyHoursSchema = z.object({
  days: z.array(weeklyDaySchema).length(7),
})

export type TimeSlotFormValue = z.infer<typeof timeSlotSchema>
export type WeeklyDayFormValue = z.infer<typeof weeklyDaySchema>
export type WeeklyHoursFormValues = z.infer<typeof weeklyHoursSchema>

export const overrideEntrySchema = z
  .object({
    type: z.enum(['BLOCKED', 'ADDED']),
    mode: z.enum(['full', 'custom']),
    start: z.number().min(0).max(1440),
    end: z.number().min(0).max(1440),
    reason: z.string().max(200).optional(),
  })
  .refine((value) => value.mode !== 'custom' || value.end > value.start, {
    message: 'End time must be after start time',
    path: ['end'],
  })

export type OverrideEntryFormValues = z.infer<typeof overrideEntrySchema>
