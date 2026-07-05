import { z } from 'zod'
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js'

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

export const userSchema = z
  .object({
    phone: z.string().optional(),
    countryCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.phone) return true // Skip validation if phone is empty
      return isValidPhoneNumber(data.phone, data.countryCode as CountryCode)
    },
    {
      message: 'invalid phone number',
      path: ['phone'], // This will show the error on the phone field
    }
  )
export type UserFormData = z.infer<typeof userSchema>
