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

export interface PortfolioItem {
  id?: string
  profileId?: string
  title: string
  description?: string
  imageUrl?: string
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
  hourlyRate?: number
  hoursPerWeek?: string
  videoIntroUrl?: string | null
  isVerified: boolean
  languages: Language[]
  education: Education[]
  skills: string[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
  employment: EmploymentEntry[]
  completedJobs: number
  inProgressJobs: number
}

type MyProfileState = {
  tutorProfile: TutorProfile | null
  setTutorProfile: (tutor: TutorProfile) => void
}
export type MyProfileSlice = {
  myProfile: MyProfileState
}
