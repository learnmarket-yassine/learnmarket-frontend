import type {
  BookingStatus,
  ExceptionType,
  HoldStatus,
  LearnRequestType,
  PayoutMethod,
  ProposalStatus,
  SessionStatus,
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
  sessionId: string | null
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
  sessionId: string
  startTime: string
  endTime: string
  status: HoldStatus
  expiresAt: string
  createdAt: string
}

export interface CreateHoldInput {
  sessionId: string
  startTime: string
}
export interface Booking {
  id: string
  tutorId: string
  learnerId: string
  sessionId: string | null
  slotHoldId: string | null
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

// Confirmed bookings on the tutor's own availability calendar (GET /tutor/bookings).
export interface TutorBooking {
  id: string
  startTime: string
  endTime: string
  sessionId: string | null
  session: { title: string } | null
  learner: { firstname: string; lastname: string }
}

export interface MyBooking {
  id: string
  startTime: string
  endTime: string
  sessionId: string | null
  session: { title: string } | null
  tutor?: { firstname: string; lastname: string }
  learner?: { firstname: string; lastname: string }
}

export interface LearnRequest {
  id: string
  learnerId: string
  type: LearnRequestType
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

// The tutor's pitch, submitted before acceptance -- no status at all.
// Session count before acceptance is contextual: sessionPlans.length.
export interface ProposalSessionPlan {
  id: string
  proposalId: string
  sessionNumber: number
  title: string
  objective: string | null
  createdAt: string
  updatedAt: string
}

// The real, committed session -- created only once the Proposal is
// accepted. Session count after acceptance is contextual: sessions.length.
export interface Session {
  id: string
  proposalId: string
  sessionNumber: number
  title: string
  objective: string | null
  status: SessionStatus
  createdAt: string
  updatedAt: string
  // Present when status is HELD (or was, until the next refetch catches up).
  slotHold?: SlotHold | null
}

// GET /sessions/:id/meeting -- shape already role-scoped server-side.
// joinUrl is whichever of start_url/join_url is correct for the caller;
// the frontend never distinguishes the two.
export type MeetingDetails =
  | { status: 'not_provisioned'; canJoinYet: false }
  | {
      status: 'provisioned'
      canJoinYet: boolean
      joinUrl: string
      password: string | null
    }

export interface CommentAuthor {
  id: string
  firstname: string
  lastname: string
  avatar: string | null
}

export interface AnnouncementAttachment {
  id: string
  key: string
  fileName: string
  mimeType: string | null
  fileSize: number | null
  createdAt: string
}

export interface AnnouncementComment {
  id: string
  content: string
  createdAt: string
  author: CommentAuthor
}

export interface Announcement {
  id: string
  sessionId: string
  authorId: string
  content: string
  createdAt: string
  author: CommentAuthor
  attachments: AnnouncementAttachment[]
  comments: AnnouncementComment[]
}

export type SubmissionStatus = 'ASSIGNED' | 'SUBMITTED' | 'EXCUSED'
export type AssignmentDisplayStatus = SubmissionStatus | 'LATE'

export interface SubmissionAttachment {
  id: string
  key: string
  fileName: string
  mimeType: string | null
  fileSize: number | null
  createdAt: string
}

export interface AssignmentSubmission {
  id: string
  status: SubmissionStatus
  submittedAt: string | null
  attachments: SubmissionAttachment[]
}

export interface AssignmentAttachment {
  id: string
  key: string
  fileName: string
  mimeType: string | null
  fileSize: number | null
  createdAt: string
}

export interface AssignmentComment {
  id: string
  content: string
  createdAt: string
  author: CommentAuthor
}

export interface Assignment {
  id: string
  sessionId: string
  title: string
  instructions: string | null
  dueAt: string | null
  createdAt: string
  updatedAt: string
  submission: AssignmentSubmission
  attachments: AssignmentAttachment[]
  comments: AssignmentComment[]
  displayStatus: AssignmentDisplayStatus
}

export type AssignmentResponse = { exists: false } | ({ exists: true } & Assignment)

export interface Proposal {
  id: string
  learnRequestId: string
  tutorId: string
  status: ProposalStatus
  sessionDurationMinutes: number
  payoutMethod: PayoutMethod
  message: string | null
  createdAt: string
  updatedAt: string
  sessionPlans: ProposalSessionPlan[]
  sessions: Session[]
  learnRequest?: LearnRequest
}
