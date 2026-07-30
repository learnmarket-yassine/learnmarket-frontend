export type SparksTransactionType = 'MONTHLY_GRANT' | 'PURCHASE' | 'PROPOSAL_SPEND' | 'REFUND'

export interface SparksOffer {
  id: string
  name: string
  sparksAmount: number
  priceCents: number
  currency: string
  isActive: boolean
  displayOrder: number
}

export interface SparksBalance {
  sparksBalance: number
}

export interface SparksTransaction {
  id: string
  type: SparksTransactionType
  amount: number
  balanceAfter: number
  proposalId: string | null
  offerId: string | null
  pricePaidCents: number | null
  createdAt: string
}

export interface GetSparksHistoryResponse {
  paginatedResult: SparksTransaction[]
  totalCount: number
}

export interface SparksPurchaseIntent {
  clientSecret: string | null
  paymentIntentId: string
  amount: number
  currency: string
}
