import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useBookingFlow } from './useBookingFlow'
import { Session } from '../types/dto'

// Regression test for the reschedule feature: after POST /bookings/:id/reschedule,
// the backend flips the session's status to PENDING_SCHEDULE and nothing else.
// This confirms that transition alone is enough for the existing booking flow
// (useBookingFlow + its ACTIONABLE_SESSION_STATUSES-driven selection) to pick
// the session back up as bookable -- with zero changes to useBookingFlow.ts,
// SlotSelectionGrid.tsx, or HoldModal.tsx.
describe('useBookingFlow (reschedule interaction)', () => {
  const baseSession: Session = {
    id: 'session-a',
    proposalId: 'proposal-1',
    sessionNumber: 1,
    title: 'Session 1',
    objective: null,
    status: 'BOOKED',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    )
  }

  it('is not actionable while BOOKED, and becomes the active session once rescheduled to PENDING_SCHEDULE', () => {
    const { result, rerender } = renderHook(
      ({ sessions }: { sessions: Session[] }) => useBookingFlow(sessions),
      { wrapper, initialProps: { sessions: [baseSession] } }
    )

    // Before reschedule: a CONFIRMED/BOOKED session isn't actionable yet.
    expect(result.current.activeSession).toBeUndefined()

    // Simulate exactly what the reschedule endpoint does server-side: the
    // booking is cancelled and the session flips to PENDING_SCHEDULE. This
    // is the only state change the reschedule feature introduces.
    const rescheduledSession: Session = { ...baseSession, status: 'PENDING_SCHEDULE' }
    rerender({ sessions: [rescheduledSession] })

    expect(result.current.activeSession?.id).toBe('session-a')
    expect(result.current.state).toEqual({ step: 'selecting' })
  })
})
