import type { AxiosInstance } from 'axios'
import type {
  AvailableSlotsQuery,
  AvailableSlotsResponse,
  Booking,
  CreateHoldInput,
  Proposal,
  SlotHold,
} from '../types/dto'

export const schedulingClient = {
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
