import { z } from 'zod'
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js'

export const onboardingSkillsSchema = z.object({
  skills: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .min(1, 'Add at least one skill')
    .max(20, 'You can add up to 20 skills'),
})

export type OnboardingSkillsFormData = z.infer<typeof onboardingSkillsSchema>

export const userInfoSchema = z
  .object({
    dateOfBirth: z.date({ error: 'Date of birth is required' }).max(new Date(), {
      message: 'Date of birth cannot be in the future',
    }),
    country: z.string().trim().min(1, 'Country is required'),
    address: z.string().trim().min(1, 'Street address is required').max(255),
    city: z.string().trim().min(1, 'City is required').max(100),
    state: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().max(20).optional(),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.phone) return false
      return isValidPhoneNumber(data.phone, data.countryCode as CountryCode)
    },
    {
      message: 'Invalid phone number',
      path: ['phone'],
    }
  )

export type UserInfoFormData = z.infer<typeof userInfoSchema>
