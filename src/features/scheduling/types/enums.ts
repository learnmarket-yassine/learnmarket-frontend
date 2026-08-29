// Mirrors enums in learnmarket-backend/prisma/schema.prisma verbatim.

export type UserRole = 'LEARNER' | 'TUTOR' | 'ADMIN'

export type ExceptionType = 'BLOCKED' | 'ADDED'

export type LearnRequestType = 'ONE_TIME' | 'COURSE'

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'

export type PayoutMethod = 'PER_SESSION' | 'ON_COMPLETION'

// The real, committed session -- created only once a Proposal is accepted.
// A ProposalSession (pre-acceptance plan) has no status at all.
export type SessionStatus =
  | 'LOCKED'
  | 'PENDING_SCHEDULE'
  | 'HELD'
  | 'BOOKED'
  | 'PENDING_REVIEW'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'

export type HoldStatus = 'ACTIVE' | 'EXPIRED' | 'CONVERTED'

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
