export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'

export type PayoutStatus =
  'PENDING' | 'PENDING_ONBOARDING' | 'RELEASED' | 'HELD_FOR_REVIEW' | 'CANCELLED' | 'FAILED'

export interface Refund {
  id: string
  amount: string
  reason: string | null
  createdAt: string
}

export interface MyPayment {
  id: string
  amount: string
  currency: string
  status: PaymentStatus
  createdAt: string
  succeededAt: string | null
  refunds: Refund[]
  proposal: {
    tutor: { firstname: string; lastname: string; avatar: string | null }
    learnRequest: { title: string }
  }
}

export interface GetMyPaymentsResponse {
  paginatedResult: MyPayment[]
  totalCount: number
  totalSpent: string
}

export interface MyPayout {
  id: string
  amount: string
  status: PayoutStatus
  triggeredAt: string
  releasedAt: string | null
  session: {
    title: string
    sessionNumber: number
    proposal: {
      learnRequest: {
        title: string
        learner: { firstname: string; lastname: string }
      }
    }
  }
}

export interface GetMyPayoutsResponse {
  paginatedResult: MyPayout[]
  totalCount: number
  totalEarned: string
}
