import { z } from 'zod'

export const SubmitFeedbackSchema = z.object({
  rating: z
    .number({ error: 'Please select a rating' })
    .int()
    .min(1, 'Please select a rating')
    .max(5),
  comment: z.string().trim().max(2000, 'Comment is too long').optional(),
})
export type SubmitFeedbackFormData = z.infer<typeof SubmitFeedbackSchema>
