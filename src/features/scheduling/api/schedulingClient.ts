import type { AxiosInstance } from 'axios'
import type {
  AvailabilityException,
  AvailabilityRule,
  AvailableSlotsQuery,
  AvailableSlotsResponse,
  Booking,
  CreateAvailabilityExceptionInput,
  CreateAvailabilityRuleInput,
  CreateHoldInput,
  Proposal,
  SlotHold,
  UpdateAvailabilityExceptionInput,
  UpdateAvailabilityRuleInput,
} from '../types/dto'

/**
 * One typed function per real backend endpoint. Hooks/components call these
 * through an `AxiosInstance` (normally `useAxiosPrivate()`) rather than
 * importing axios directly.
 */
export const schedulingClient = {
  // --- Availability rules (TUTOR only) ---
  listAvailabilityRules: (api: AxiosInstance) =>
    api.get<AvailabilityRule[]>('/tutor/availability/rules').then((r) => r.data),

  createAvailabilityRule: (api: AxiosInstance, input: CreateAvailabilityRuleInput) =>
    api.post<AvailabilityRule>('/tutor/availability/rules', input).then((r) => r.data),

  updateAvailabilityRule: (api: AxiosInstance, id: string, input: UpdateAvailabilityRuleInput) =>
    api.patch<AvailabilityRule>(`/tutor/availability/rules/${id}`, input).then((r) => r.data),

  deleteAvailabilityRule: (api: AxiosInstance, id: string) =>
    api.delete<void>(`/tutor/availability/rules/${id}`).then((r) => r.data),

  // --- Availability exceptions (TUTOR only) ---
  listAvailabilityExceptions: (api: AxiosInstance) =>
    api.get<AvailabilityException[]>('/tutor/availability/exceptions').then((r) => r.data),

  createAvailabilityException: (api: AxiosInstance, input: CreateAvailabilityExceptionInput) =>
    api.post<AvailabilityException>('/tutor/availability/exceptions', input).then((r) => r.data),

  updateAvailabilityException: (
    api: AxiosInstance,
    id: string,
    input: UpdateAvailabilityExceptionInput
  ) =>
    api
      .patch<AvailabilityException>(`/tutor/availability/exceptions/${id}`, input)
      .then((r) => r.data),

  deleteAvailabilityException: (api: AxiosInstance, id: string) =>
    api.delete<void>(`/tutor/availability/exceptions/${id}`).then((r) => r.data),

  // --- Available slots (public/learner-facing, no auth guard) ---
  getAvailableSlots: (api: AxiosInstance, tutorId: string, query: AvailableSlotsQuery) =>
    api
      .get<AvailableSlotsResponse>(`/tutors/${tutorId}/available-slots`, { params: query })
      .then((r) => r.data),

  // --- Holds (LEARNER only) ---
  createHold: (api: AxiosInstance, input: CreateHoldInput) =>
    api.post<SlotHold>('/holds', input).then((r) => r.data),

  confirmHold: (api: AxiosInstance, holdId: string) =>
    api.post<Booking>(`/holds/${holdId}/confirm`).then((r) => r.data),

  releaseHold: (api: AxiosInstance, holdId: string) =>
    api.post<SlotHold>(`/holds/${holdId}/release`).then((r) => r.data),

  // --- Bookings ---
  cancelBooking: (api: AxiosInstance, bookingId: string) =>
    api.patch<Booking>(`/bookings/${bookingId}/cancel`).then((r) => r.data),

  // --- Proposals ---
  listProposals: (api: AxiosInstance) => api.get<Proposal[]>('/proposals').then((r) => r.data),

  getProposal: (api: AxiosInstance, id: string) =>
    api.get<Proposal>(`/proposals/${id}`).then((r) => r.data),
}
