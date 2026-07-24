import { SERVICE_FEE_PERCENT } from '@/lib/Constants'

export interface ProposalPricePreview {
  serviceFee: number
  learnerTotal: number
}

const round2 = (value: number) => Math.round(value * 100) / 100
export function getProposalPricePreview(tutorPrice: number): ProposalPricePreview {
  const serviceFee = round2(tutorPrice * SERVICE_FEE_PERCENT)
  return { serviceFee, learnerTotal: round2(tutorPrice + serviceFee) }
}
