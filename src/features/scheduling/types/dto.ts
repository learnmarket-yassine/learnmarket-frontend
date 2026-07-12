import type {
  BookingStatus,
  ExceptionType,
  HoldStatus,
  JobRequestType,
  ProposalSessionStatus,
  ProposalStatus,
} from './enums'

// --- Availability rules: /tutor/availability/rules ---

export interface AvailabilityRule {
  id: string
  tutorId: string
  /** 0 = Sunday ... 6 = Saturday, matches JS Date.getDay() */
  dayOfWeek: number
  /** Minutes since midnight, local to `timezone` */
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

// --- Availability exceptions: /tutor/availability/exceptions ---

export interface AvailabilityException {
  id: string
  tutorId: string
  /** ISO date string (date-only) */
  date: string
  type: ExceptionType
  /** Both null together means "whole day" */
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

// --- Available slots: /tutors/:tutorId/available-slots ---

export interface AvailableSlotsQuery {
  fromDate: string
  toDate: string
  durationMinutes: number
}

export interface AvailableSlotsResponse {
  /** ISO datetime start times only; end = start + durationMinutes */
  slots: string[]
}

// --- Conflict payload: 409 thrown by rule/exception writes ---

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

// --- Holds: /holds ---

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

// --- Bookings: /bookings ---

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

// --- Job requests / proposals ---

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
  /** Always 1 for ONE_TIME proposals; 1..totalSessions for COURSE */
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
  /** Only present on GET /proposals/:id, not on the list endpoint */
  jobRequest?: JobRequest
}
