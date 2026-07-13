import type {
  BookingStatus,
  ExceptionType,
  HoldStatus,
  JobRequestType,
  ProposalSessionStatus,
  ProposalStatus,
} from './enums'

export interface AvailabilityRule {
  id: string
  tutorId: string
  dayOfWeek: number
  startTime: number
  endTime: number
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAvailabilityRuleInput {
  dayOfWeek: number
  startTime: number
  endTime: number
  timezone: string
  isActive?: boolean
}

export type UpdateAvailabilityRuleInput = Partial<CreateAvailabilityRuleInput>
export interface AvailabilityException {
  id: string
  tutorId: string
  date: string
  type: ExceptionType
  startTime: number | null
  endTime: number | null
  reason: string | null
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface CreateAvailabilityExceptionInput {
  date: string
  type: ExceptionType
  startTime?: number
  endTime?: number
  reason?: string
  timezone: string
}

export type UpdateAvailabilityExceptionInput = Partial<CreateAvailabilityExceptionInput>
export interface AvailableSlotsQuery {
  fromDate: string
  toDate: string
  durationMinutes: number
}

export interface AvailableSlotsResponse {
  slots: string[]
}

export interface AffectedSession {
  bookingId: string
  proposalSessionId: string | null
  startTime: string
  endTime: string
}

export interface AvailabilityConflictPayload {
  message: string
  affectedSessions: AffectedSession[]
}

export interface SlotHold {
  id: string
  tutorId: string
  learnerId: string
  proposalSessionId: string
  startTime: string
  endTime: string
  status: HoldStatus
  expiresAt: string
  createdAt: string
}

export interface CreateHoldInput {
  proposalSessionId: string
  startTime: string
  endTime: string
}
export interface Booking {
  id: string
  tutorId: string
  learnerId: string
  proposalSessionId: string | null
  slotHoldId: string | null
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

export interface JobRequest {
  id: string
  learnerId: string
  type: JobRequestType
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface ProposalSession {
  id: string
  proposalId: string
  sessionNumber: number
  title: string
  objective: string | null
  status: ProposalSessionStatus
  createdAt: string
  updatedAt: string
}

export interface Proposal {
  id: string
  jobRequestId: string
  tutorId: string
  status: ProposalStatus
  totalSessions: number
  sessionDurationMinutes: number
  message: string | null
  createdAt: string
  updatedAt: string
  sessions: ProposalSession[]
  jobRequest?: JobRequest
}
