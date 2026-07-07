import { Annonce } from '@/features/annonces/types'

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'

export interface Proposal {
  id: string
  annonceId: string
  tutorId: string
  message: string | null
  status: ProposalStatus
  createdAt: string
  annonce?: Annonce
}
