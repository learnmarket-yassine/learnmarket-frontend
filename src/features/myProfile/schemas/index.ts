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

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const skillsSchema = z.object({
  skills: z
    .array(skillSchema)
    .min(1, 'Add at least one skill')
    .max(10, 'You can add up to 10 skills'),
})

export type SkillsFormValues = z.infer<typeof skillsSchema>

const specialtySchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string(),
})

export const specialtiesSchema = z.object({
  specialties: z
    .array(specialtySchema)
    .min(1, 'Select at least one specialty')
    .max(5, 'You can select up to 3 specialties'),
})

export type SpecialtiesFormValues = z.infer<typeof specialtiesSchema>

export const learnerInterestsSchema = z.object({
  interests: z
    .array(specialtySchema)
    .min(1, 'Select at least one interest')
    .max(20, 'You can select up to 20 interests'),
})

export type LearnerInterestsFormValues = z.infer<typeof learnerInterestsSchema>

export const availabilityDayEnum = z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
export const availabilitySlotEnum = z.enum(['MORNING', 'AFTERNOON', 'EVENING'])

export const learnerAvailabilitySchema = z.object({
  slots: z
    .array(z.object({ day: availabilityDayEnum, slot: availabilitySlotEnum }))
    .min(1, 'Select at least one time slot')
    .max(21, 'You can select up to 21 time slots'),
})

export type LearnerAvailabilityFormValues = z.infer<typeof learnerAvailabilitySchema>

export const portfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Project title is required')
    .max(150, 'Project title is too long'),

  role: z.string().trim().max(100, 'Role is too long').optional(),

  description: z
    .string()
    .trim()
    .min(1, 'Project description is required')
    .max(5000, 'Project description is too long'),

  skills: z
    .array(skillSchema)
    .min(1, 'Add at least one skill')
    .max(5, 'You can add up to 5 skills'),
})

export type PortfolioFormValues = z.infer<typeof portfolioSchema>
