import { z } from 'zod'

export const tutorOnboardingSchema = z.object({
  headline: z.string().trim().min(1, 'Ce champ est obligatoire').max(150, 'Le titre est trop long'),
  bio: z
    .string()
    .trim()
    .min(1, 'Ce champ est obligatoire')
    .max(5000, 'Le bio ne doit pas dépasser 5000 caractères'),
  hourlyRate: z
    .number({ error: 'Ce champ est obligatoire' })
    .positive('Le tarif horaire doit être supérieur à 0'),
})

export type TutorOnboardingFormData = z.infer<typeof tutorOnboardingSchema>
