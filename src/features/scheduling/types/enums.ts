// Mirrors enums in learnmarket-backend/prisma/schema.prisma verbatim.

export type UserRole = 'LEARNER' | 'TUTOR' | 'ADMIN'

export type ExceptionType = 'BLOCKED' | 'ADDED'

export type JobRequestType = 'ONE_TIME' | 'COURSE'

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'

export type ProposalSessionStatus =
  'LOCKED' | 'PENDING_SCHEDULE' | 'HELD' | 'BOOKED' | 'COMPLETED' | 'CANCELLED'

export type HoldStatus = 'ACTIVE' | 'EXPIRED' | 'CONVERTED'

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
