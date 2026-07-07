export interface ConnectsPackage {
  id: string
  name: string
  amount: number
  priceCents: number
  currency: string
  isActive: boolean
}

export type ConnectsTransactionType = 'PURCHASE' | 'SPEND' | 'REFUND' | 'BONUS' | 'SIGNUP_GRANT'

export interface ConnectsTransaction {
  id: string
  tutorId: string
  type: ConnectsTransactionType
  amount: number
  balanceAfter: number
  relatedProposalId: string | null
  relatedPackageId: string | null
  stripePaymentIntentId: string | null
  createdAt: string
}

export interface ConnectsTransactionsResponse {
  items: ConnectsTransaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ConnectsBalance {
  connects: number
}
