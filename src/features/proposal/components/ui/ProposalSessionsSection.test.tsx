import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import ProposalSessionsSection from './ProposalSessionsSection'
import { ProposalSessionPlan } from '../../store/types'

afterEach(cleanup)

function makeSessions(count: number): ProposalSessionPlan[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `session-${i + 1}`,
    proposalId: 'proposal-1',
    sessionNumber: i + 1,
    title: `Session ${i + 1}`,
    objective: i === 0 ? null : '<p>Do the thing</p>',
  }))
}

describe('ProposalSessionsSection (read-only)', () => {
  it('shows the summary line with total count and total duration across all sessions', () => {
    render(<ProposalSessionsSection sessions={makeSessions(6)} sessionDurationMinutes={30} />)
    expect(screen.getByText(/6 sessions/)).toBeInTheDocument()
    // 30 min * 6 sessions = 180 min = 3h, summed across ALL sessions, not just page 1.
    expect(screen.getByText(/3h total/)).toBeInTheDocument()
  })

  it('renders collapsed by default with a clamped preview and a placeholder when empty', () => {
    render(<ProposalSessionsSection sessions={makeSessions(2)} sessionDurationMinutes={30} />)
    const header1 = screen.getByText('Session 1').closest('[role="button"]')!
    expect(header1).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('No objective provided')).toBeInTheDocument()

    const preview = screen.getByText('Do the thing')
    expect(preview.closest('.line-clamp-2')).not.toBeNull()
  })

  it('expands to show the full objective and collapses whichever was open (single-open)', async () => {
    const user = userEvent.setup()
    render(<ProposalSessionsSection sessions={makeSessions(2)} sessionDurationMinutes={30} />)

    const header1 = screen.getByText('Session 1').closest('[role="button"]')!
    const header2 = screen.getByText('Session 2').closest('[role="button"]')!

    await user.click(header2)
    expect(header2).toHaveAttribute('aria-expanded', 'true')
    const panelId = header2.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)!
    const fullText = within(panel).getByText('Do the thing')
    expect(fullText.closest('.line-clamp-2')).toBeNull()

    await user.click(header1)
    expect(header1).toHaveAttribute('aria-expanded', 'true')
    expect(header2).toHaveAttribute('aria-expanded', 'false')

    await user.click(header1)
    expect(header1).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports Enter/Space on the header to toggle', async () => {
    const user = userEvent.setup()
    render(<ProposalSessionsSection sessions={makeSessions(1)} />)

    const header = screen.getByText('Session 1').closest<HTMLElement>('[role="button"]')!
    header.focus()
    await user.keyboard('{Enter}')
    expect(header).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard(' ')
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('paginates, using full-array position for the badge, and closes the open card on page change', async () => {
    const user = userEvent.setup()
    render(<ProposalSessionsSection sessions={makeSessions(6)} sessionDurationMinutes={30} />)

    expect(screen.getByText('Session 3')).toBeInTheDocument()
    expect(screen.queryByText('Session 4')).not.toBeInTheDocument()

    const header3 = screen.getByText('Session 3').closest('[role="button"]')!
    await user.click(header3)
    expect(header3).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('link', { name: 'Go to next page' }))

    expect(screen.getByText('Session 4')).toBeInTheDocument()
    expect(screen.queryByText('Session 3')).not.toBeInTheDocument()
    // Badge numbering reflects full-array position (4, 5, 6), not page position (1, 2, 3).
    const header4 = screen.getByText('Session 4').closest<HTMLElement>('[role="button"]')!
    expect(within(header4).getByText('4')).toBeInTheDocument()
    expect(header4).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows a fallback when there are no sessions', () => {
    render(<ProposalSessionsSection sessions={[]} />)
    expect(screen.getByText('No session plan available.')).toBeInTheDocument()
  })
})
