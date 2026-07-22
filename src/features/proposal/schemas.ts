import { z } from 'zod'

const sessionPlanSchema = z.object({
  title: z.string().trim().min(1, 'Session title is required'),
  objective: z.string().trim().optional(),
})

export function buildProposalSchema(learnRequestType: 'ONE_TIME' | 'COURSE') {
  return z
    .object({
      sessionDurationMinutes: z
        .number({ error: 'Session duration is required' })
        .int()
        .positive('Must be a positive number of minutes'),
      totalPrice: z.number({ error: 'Price is required' }).positive('Must be greater than 0'),
      payoutMethod: z.enum(['PER_SESSION', 'ON_COMPLETION'], {
        error: 'Choose how you want to be paid',
      }),
      message: z.string().trim().optional(),
      sessionPlans: z.array(sessionPlanSchema).min(1, 'Add at least one session'),
    })
    .superRefine((data, ctx) => {
      if (learnRequestType === 'ONE_TIME' && data.sessionPlans.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sessions'],
          message: 'A one-time request can only have exactly one session',
        })
      }
      if (data.sessionPlans.length === 1 && data.payoutMethod !== 'ON_COMPLETION') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payoutMethod'],
          message: 'A single session must be paid "By Course"',
        })
      }
    })
}

export type ProposalFormValues = z.infer<ReturnType<typeof buildProposalSchema>>
