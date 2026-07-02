export interface Language {
  name: string
  level: string
}

export interface Education {
  id: string
  institution: string
  degree?: string
  fieldOfStudy?: string
  startYear?: number
  endYear?: number
}

export interface EmploymentEntry {
  id: string
  title: string
  company: string
  period: string
  description: string
}

export interface PortfolioItem {
  id: string
  title: string
  imageUrl?: string
}

export interface Skill {
  id: string
  label: string
}

export interface Testimonial {
  id: string
  author: string
  content: string
  rating: number
}

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
}

export interface WorkHistoryTab {
  label: string
  count: number
  key: 'completed' | 'in_progress'
}

export interface TutorProfile {
  id: string
  name: string
  isVerified: boolean
  location: string
  localTime: string
  avatarUrl?: string
  headline: string
  hourlyRate: number
  bio: string
  connects: number
  hoursPerWeek: string
  videoIntroUrl?: string
  languages: Language[]
  education: Education[]
  skills: Skill[]
  portfolio: PortfolioItem[]
  testimonials: Testimonial[]
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
