import { Language } from '@/features/myProfile/store/types'
import { Skill } from '@/types/skill'

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'
export type PayoutMethod = 'PER_SESSION' | 'ON_COMPLETION'

export interface ProposalSessionPlan {
  id: string
  proposalId: string
  sessionNumber: number
  title: string
  objective: string | null
}

export interface ProposalTutorSummary {
  id: string
  firstname: string
  lastname: string
  avatar: string | null
  headline: string | null
  country: string | null
  bio: string | null
  languages: Language[] | null
  tutorProfile: {
    hourlyRate: number | string | null
    skills: { skill: Skill }[]
    videoIntroUrl: string | null
  } | null
}

export interface Proposal {
  id: string
  learnRequestId: string
  tutorId: string
  status: ProposalStatus
  sessionDurationMinutes: number
  totalPrice: number | string
  payoutMethod: PayoutMethod
  message: string | null
  sessionPlans: ProposalSessionPlan[]
  tutor: ProposalTutorSummary
  learnerViewedAt: string | null
  createdAt: string
  updatedAt: string
}
