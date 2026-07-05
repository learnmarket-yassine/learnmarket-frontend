import { z } from 'zod'

export const headlineSchema = z.object({
  headline: z.string().min(1, 'Ce champ est obligatoire'),
})

export type HeadLineFormData = z.infer<typeof headlineSchema>

export const overviewSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(1, 'Ce champ est obligatoire')
    .max(5000, 'Le bio ne doit pas dépasser 5000 caractères'),
})

export type OverviewFormData = z.infer<typeof overviewSchema>

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

export const educationSchema = z
  .object({
    institution: z
      .string()
      .trim()
      .min(1, "L'établissement est obligatoire")
      .max(150, "Le nom de l'établissement est trop long"),

    degree: z
      .string()
      .trim()
      .min(1, 'Le diplôme est obligatoire')
      .max(100, 'Le nom du diplôme est trop long'),

    fieldOfStudy: z
      .string()
      .trim()
      .min(1, "Le domaine d'études est obligatoire")
      .max(100, "Le domaine d'études est trop long"),

    startYear: z
      .number({
        error: "L'année de début est obligatoire",
      })
      .int("L'année doit être un entier")
      .min(1900, 'Année invalide')
      .max(new Date().getFullYear(), 'Année invalide'),

    endYear: z
      .number({
        error: "L'année de fin est obligatoire",
      })
      .int("L'année doit être un entier")
      .min(1900, 'Année invalide')
      .max(new Date().getFullYear() + 10, 'Année invalide'),
  })
  .refine((data) => data.endYear >= data.startYear, {
    message: "L'année de fin doit être supérieure ou égale à l'année de début",
    path: ['endYear'],
  })

export type EducationFormData = z.infer<typeof educationSchema>

export const LanguageLevelEnum = z.enum([
  'BASIC',
  'CONVERSATIONAL',
  'FLUENT',
  'NATIVE_OR_BILINGUAL',
])

export const LanguageRowSchema = z.object({
  id: z.string().optional(), // if you're tracking existing rows
  language: z.string().min(1, 'Language is required'),
  level: LanguageLevelEnum,
})

export const EditLanguagesSchema = z.object({
  languages: z.array(LanguageRowSchema).min(1, 'Add at least one language'),
})

export type EditLanguagesFormData = z.infer<typeof EditLanguagesSchema>

export const employmentSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "L'établissement est obligatoire")
      .max(150, "Le nom de l'établissement est trop long"),

    jobTitle: z
      .string()
      .trim()
      .min(1, 'Le poste est obligatoire')
      .max(100, 'Le titre du poste est trop long'),
    city: z
      .string()
      .trim()
      .min(1, 'La ville est obligatoire')
      .max(100, 'Nom de ville trop long')
      .optional(),

    country: z
      .string()
      .trim()
      .min(1, 'Le pays est obligatoire')
      .max(100, 'Nom de pays trop long')
      .optional(),

    description: z.string().trim().max(1000, 'La description est trop longue').optional(),

    startDate: z.date({
      error: 'La date de début est obligatoire',
    }),

    current: z.boolean(),

    endDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.current && !data.endDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: "La date de fin est obligatoire si ce n'est pas un emploi actuel",
      })
    }

    if (data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'La date de fin doit être supérieure ou égale à la date de début',
      })
    }
  })

export type EmploymentFormData = z.infer<typeof employmentSchema>

export const skillsSchema = z.object({
  skills: z
    .array(z.string().min(1).max(30))
    .min(1, 'Add at least one skill')
    .max(10, 'You can add up to 10 skills'),
})

export type SkillsFormValues = z.infer<typeof skillsSchema>

export const hourlyRateSchema = z.object({
  hourlyRate: z
    .number({
      error: 'Hourly rate is required',
    })
    .min(0, 'Hourly rate cannot be negative')
    .max(10000, 'Hourly rate is too high'),
})

export type HourlyRateFormData = z.infer<typeof hourlyRateSchema>
