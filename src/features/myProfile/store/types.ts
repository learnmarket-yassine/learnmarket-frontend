import { Skill } from '@/types/skill'
import { Specialty } from '@/types/category'

export enum LanguageLevel {
  BASIC = 'BASIC',
  CONVERSATIONAL = 'CONVERSATIONAL',
  FLUENT = 'FLUENT',
  NATIVE_OR_BILINGUAL = 'NATIVE_OR_BILINGUAL',
}
export interface Language {
  id?: string
  profileId?: string
  language: string
  level: LanguageLevel
}

export interface Education {
  id: string
  profileId?: string
  institution: string
  degree?: string
  fieldOfStudy?: string
  startYear?: number
  endYear?: number
}

export interface EmploymentEntry {
  id: string
  profileId?: string
  jobTitle: string
  company: string
  description?: string
  startDate: string
  endDate?: string
  current?: boolean
  country?: string
  city?: string
}

export type PortfolioMediaType = 'IMAGE' | 'VIDEO_FILE' | 'VIDEO_LINK' | 'LINK'

export interface PortfolioMedia {
  id: string
  type: PortfolioMediaType
  key?: string | null
  url: string | null
  position: number
}

export interface PortfolioItem {
  id?: string
  profileId?: string
  title: string
  role?: string
  description?: string
  skills?: Skill[]
  media?: PortfolioMedia[]
  createdAt?: string
}

export interface CertificationFile {
  id: string
  fileName: string | null
  mimeType: string | null
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issuedAt?: string | null
  expiresAt?: string | null
  credentialUrl?: string | null
  files: CertificationFile[]
}

export interface WorkHistoryTab {
  label: string
  count: number
  key: 'completed' | 'in_progress'
}

export type TutorVerificationStatus =
  'UNSUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED'

export interface TutorProfile {
  id: string
  videoIntroUrl?: string | null
  verificationStatus: TutorVerificationStatus
  submittedAt?: string | null
  reviewedAt?: string | null
  reviewNote?: string | null
  skills: Skill[]
  specialties: Specialty[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
  employment: EmploymentEntry[]
  completedJobs: number
  inProgressJobs: number
  stripeAccountId?: string | null
  stripeChargesEnabled: boolean
  stripePayoutsEnabled: boolean
}

export type AvailabilityDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
export type AvailabilitySlotTime = 'MORNING' | 'AFTERNOON' | 'EVENING'

export interface AvailabilitySlotValue {
  day: AvailabilityDay
  slot: AvailabilitySlotTime
}

export interface LearnerProfile {
  id: string
  availability: AvailabilitySlotValue[]
  interests: Specialty[]
}

type MyProfileState = {
  tutorProfile: TutorProfile | null
  setTutorProfile: (tutor: TutorProfile) => void
}
export type MyProfileSlice = {
  myProfile: MyProfileState
}
