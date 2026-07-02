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

const LanguageSchema = z.object({
  language: z.string().min(1),
  level: z.string().min(1),
})

export const EditLanguagesSchema = z.object({
  languages: z.array(LanguageSchema),
})

export type EditLanguagesFormData = z.infer<typeof EditLanguagesSchema>
