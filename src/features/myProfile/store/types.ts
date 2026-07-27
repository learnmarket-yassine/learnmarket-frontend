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

export interface Certification {
  id?: string
  pofileId?: string
  title: string
  issuer: string
  issuedAt?: string
  expiresAt?: string
  credentialUrl?: string
}

export interface WorkHistoryTab {
  label: string
  count: number
  key: 'completed' | 'in_progress'
}

export interface TutorProfile {
  id: string
  videoIntroUrl?: string | null
  isVerified: boolean
  skills: Skill[]
  specialties: Specialty[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
  employment: EmploymentEntry[]
  completedJobs: number
  inProgressJobs: number
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
