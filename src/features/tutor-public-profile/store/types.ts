import {
  Certification,
  EmploymentEntry,
  Language,
  PortfolioItem,
  TutorVerificationStatus,
} from '@/features/myProfile/store/types'
import { Skill } from '@/types/skill'
import { Specialty } from '@/types/category'

export interface PublicTutorProfile {
  id: string
  firstname: string
  lastname: string
  avatar: string | null
  headline: string | null
  bio: string | null
  country: string | null
  city: string | null
  languages: Language[]
  tutorProfile: {
    videoIntroUrl: string | null
    verificationStatus: TutorVerificationStatus
    skills: { skill: Skill }[]
    specialties: { specialty: Specialty }[]
    portfolio: PortfolioItem[]
    certifications: Certification[]
    employment: EmploymentEntry[]
  }
}
