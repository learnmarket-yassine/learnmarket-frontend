import z from 'zod'
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/

export const userInfoSchema = z
  .object({
    dateOfBirth: z
      .date({ error: 'Date of birth is required' })
      .max(new Date(), {
        message: 'Date of birth cannot be in the future',
      })
      .optional(),
    country: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().max(20).optional(),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: 'Password must be at least 8 characters',
      })
      .refine((val) => !val || passwordRegex.test(val), {
        message: 'Password must contain uppercase, lowercase, and number',
      }),
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
  .refine(
    (data) => {
      // Neither password provided → valid
      if (!data.oldPassword && !data.newPassword) {
        return true
      }

      // Both must be provided
      return !!data.oldPassword && !!data.newPassword
    },
    {
      message: 'Old password and new password are required to change your password',
      path: ['newPassword'],
    }
  )

export type UserInfoFormData = z.infer<typeof userInfoSchema>
