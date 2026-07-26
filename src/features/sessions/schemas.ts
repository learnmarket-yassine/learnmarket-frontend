import { z } from 'zod'
import { richTextToPlainText } from '@/lib/richText'

export const CreateAnnouncementSchema = z.object({
  content: z
    .string()
    .trim()
    .max(5000, 'Too long')
    .refine((value) => richTextToPlainText(value).length > 0, 'This field is required'),
})

export type CreateAnnouncementFormData = z.infer<typeof CreateAnnouncementSchema>

export const AssignmentSchema = z.object({
  title: z.string().trim().min(1, 'This field is required').max(200, 'Too long'),
  instructions: z.string().trim().optional(),
  dueAt: z.string().optional(),
})

export type AssignmentFormData = z.infer<typeof AssignmentSchema>
