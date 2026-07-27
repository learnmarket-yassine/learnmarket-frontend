import { Language } from '@/features/myProfile/store/types'
import { Skill } from '@/types/skill'
import { LearnRequest } from '@/features/learn-requests/store/types'

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
  tutorTotal: number
  serviceFee: number
  payoutMethod: PayoutMethod
  message: string | null
  sessionPlans: ProposalSessionPlan[]
  tutor: ProposalTutorSummary
  learnerViewedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProposalGroup = 'ACTIVE' | 'ARCHIVED'

export interface ProposalLearnRequestSummary {
  id: string
  title: string
  category: { name: string } | null
}

export interface MyProposal {
  id: string
  learnRequestId: string
  tutorId: string
  status: ProposalStatus
  sessionDurationMinutes: number
  totalPrice: number | string
  tutorTotal: number
  serviceFee: number
  payoutMethod: PayoutMethod
  message: string | null
  learnerViewedAt: string | null
  createdAt: string
  updatedAt: string
  learnRequest: ProposalLearnRequestSummary
}
export interface MyProposalDetail {
  id: string
  learnRequestId: string
  tutorId: string
  status: ProposalStatus
  sessionDurationMinutes: number
  totalPrice: number | string
  tutorTotal: number
  serviceFee: number
  payoutMethod: PayoutMethod
  message: string | null
  sessionPlans: ProposalSessionPlan[]
  sessions: ProposalSessionPlan[]
  learnerViewedAt: string | null
  createdAt: string
  updatedAt: string
  learnRequest: LearnRequest
}
