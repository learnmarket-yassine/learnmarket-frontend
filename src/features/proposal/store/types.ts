import { AuthUser } from '@/features/auth/store/types'

export interface sessionPlan {
  id: string
  proposalId: string
}

export interface Proposal {
  createdAt: string
  id: string
  learnRequestId: string
  learnerViewedAt: string
  message: string
  payoutMethod: string
  sessionDurationMinutes: number
  sessionPlans: sessionPlan[]
  status: string
  totalPrice: string
  tutor: AuthUser
  tutorId: string
  updatedAt: string
}
