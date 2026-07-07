export type AnnonceStatus = 'OPEN' | 'CLOSED'

export interface Annonce {
  id: string
  learnerId: string
  title: string
  description: string | null
  status: AnnonceStatus
  proposalCost: number
  createdAt: string
}

export interface CreateAnnonceInput {
  title: string
  description?: string
  proposalCost?: number
}
