import { PayoutMethod, ProposalStatus } from '../store/types'

export const PAYOUT_METHOD_LABELS: Record<PayoutMethod, string> = {
  PER_SESSION: 'By Session',
  ON_COMPLETION: 'By Course',
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Hired',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
}
