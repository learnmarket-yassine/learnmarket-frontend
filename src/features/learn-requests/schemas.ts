import { z } from 'zod'
import { LearnRequestType } from './store/types'

export const titleSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})

export type TitleFormData = z.infer<typeof titleSchema>

export const categorySkillsSchema = z.object({
  categoryId: z.uuid('Category is required'),
  skillIds: z.array(z.uuid()).min(1, 'At least one skill is required'),
})

export type CategorySkillsFormData = z.infer<typeof categorySkillsSchema>

export function makeLevelPreferencesSchema(type: LearnRequestType | null) {
  return z
    .object({
      level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
        error: 'Level is required',
      }),
      preferredLanguages: z.array(z.string()).min(1, 'At least one language is required'),
      requestedFrequency: z.number().int().positive().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      if (type === 'COURSE' && !data.requestedFrequency) {
        ctx.addIssue({
          code: 'custom',
          message: 'Sessions per week is required for a course',
          path: ['requestedFrequency'],
        })
      }
      if (type === 'ONE_TIME' && data.requestedFrequency) {
        ctx.addIssue({
          code: 'custom',
          message: 'Sessions per week must be empty for a one-time session',
          path: ['requestedFrequency'],
        })
      }
    })
}

export type LevelPreferencesFormData = z.infer<ReturnType<typeof makeLevelPreferencesSchema>>

export const budgetSchema = z
  .object({
    budgetMin: z
      .number({ error: 'Minimum budget is required' })
      .nonnegative('Minimum budget must be non-negative'),
    budgetMax: z
      .number({ error: 'Maximum budget is required' })
      .nonnegative('Maximum budget must be non-negative'),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: 'Maximum budget must be greater than or equal to the minimum',
    path: ['budgetMax'],
  })

export type BudgetFormData = z.infer<typeof budgetSchema>

export const MAX_DESCRIPTION_LENGTH = 2000

export const detailsSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`
    ),
})

export type DetailsFormData = z.infer<typeof detailsSchema>
