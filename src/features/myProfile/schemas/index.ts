import { z } from 'zod'

export const headlineSchema = z.object({
  headline: z.string().min(1, 'Ce champ est obligatoire'),
})

export type HeadLineFormData = z.infer<typeof headlineSchema>

export const availabilitySchema = z.object({
  hoursPerWeek: z.string().min(1, 'Ce champ est obligatoire'),
})

export type AvailabilityFormData = z.infer<typeof availabilitySchema>

export const videoIntroSchema = z.object({
  videoIntroUrl: z.string().min(1, 'Ce champ est obligatoire'),
})

export type VideoIntroFormData = z.infer<typeof videoIntroSchema>

export const AddLanguageSchema = z.object({
  language: z.string().min(1, 'Ce champ est obligatoire'),
  level: z.string().min(1, 'Ce champ est obligatoire'),
})

export type AddLanguageFormData = z.infer<typeof AddLanguageSchema>
