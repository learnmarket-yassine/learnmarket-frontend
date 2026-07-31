import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SessionCard from './SessionCard'
import type { Session } from '../../types/dto'
import type { SessionStatus } from '../../types/enums'

vi.mock('@/features/sessions/hooks/useGetSessionContext', () => ({
  default: vi.fn(() => ({ data: undefined, isLoading: false })),
}))

afterEach(cleanup)

const baseSession: Session = {
  id: 'session-a',
  proposalId: 'proposal-1',
  sessionNumber: 1,
  title: 'Session 1',
  objective: null,
  status: 'PENDING_SCHEDULE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const renderCard = (status: SessionStatus) =>
  render(
    <MemoryRouter>
      <SessionCard session={{ ...baseSession, status }} isActive={false} onSchedule={vi.fn()} />
    </MemoryRouter>
  )

describe('SessionCard', () => {
  it('always shows the View details icon', () => {
    ;(
      [
        'LOCKED',
        'PENDING_SCHEDULE',
        'HELD',
        'BOOKED',
        'PENDING_REVIEW',
        'COMPLETED',
        'CANCELLED',
      ] as const
    ).forEach((status) => {
      const { unmount } = renderCard(status)
      expect(screen.getByRole('button', { name: 'View details' })).toBeInTheDocument()
      unmount()
    })
  })

  it('disables the Schedule icon for LOCKED with a reason', () => {
    renderCard('LOCKED')
    const button = screen.getByRole('button', { name: 'Schedule' })
    expect(button).toBeDisabled()
  })

  it('enables "Schedule" for PENDING_SCHEDULE', () => {
    renderCard('PENDING_SCHEDULE')
    expect(screen.getByRole('button', { name: 'Schedule' })).toBeEnabled()
  })

  it('enables "Resume" for HELD', () => {
    renderCard('HELD')
    expect(screen.getByRole('button', { name: 'Resume' })).toBeEnabled()
  })

  it('enables "Reschedule" for BOOKED', () => {
    renderCard('BOOKED')
    expect(screen.getByRole('button', { name: 'Reschedule' })).toBeEnabled()
  })

  it('enables "Schedule" for CANCELLED, identically to PENDING_SCHEDULE', () => {
    renderCard('CANCELLED')
    expect(screen.getByRole('button', { name: 'Schedule' })).toBeEnabled()
  })

  it('shows Respond instead of Schedule/Reschedule for PENDING_REVIEW', () => {
    renderCard('PENDING_REVIEW')
    expect(screen.getByRole('button', { name: 'Respond' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Schedule' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reschedule' })).not.toBeInTheDocument()
  })

  it('hides the schedule action and Respond entirely for COMPLETED', () => {
    renderCard('COMPLETED')
    expect(screen.queryByRole('button', { name: 'Schedule' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reschedule' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Respond' })).not.toBeInTheDocument()
  })
})
