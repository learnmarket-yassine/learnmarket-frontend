import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFieldArray, useForm } from 'react-hook-form'
import { afterEach, describe, expect, it } from 'vitest'
import ProposalFormSessionsSection from './ProposalSessionsSection'
import { ProposalFormValues } from '@/features/proposal/schemas'

afterEach(cleanup)

// Mounts the section exactly like CreateProposalForm does, so we can drive
// the real accordion / add / edit / reorder / delete flows through RTL
// instead of the full authenticated app (no backend/credentials here).
function Harness({ sessionCount = 1 }: { sessionCount?: number }) {
  const form = useForm<ProposalFormValues>({
    defaultValues: {
      sessionPlans: Array.from({ length: sessionCount }, (_, i) => ({
        title: `Session ${i + 1}`,
        objective: i === 0 ? '' : '<p>Do the thing</p>',
      })),
    },
  })
  const { fields, append, update, remove, replace } = useFieldArray({
    control: form.control,
    name: 'sessionPlans',
    keyName: 'fieldId',
  })

  return (
    <ProposalFormSessionsSection
      learnRequestType="COURSE"
      errors={form.formState.errors}
      fields={fields}
      append={append}
      update={update}
      remove={remove}
      replace={replace}
    />
  )
}

describe('ProposalFormSessionsSection', () => {
  it('renders all sessions collapsed by default', () => {
    render(<Harness sessionCount={2} />)
    const header1 = screen.getByText('Session 1').closest('[role="button"]')!
    const header2 = screen.getByText('Session 2').closest('[role="button"]')!
    expect(header1).toHaveAttribute('aria-expanded', 'false')
    expect(header2).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
  })

  it('shows a clamped safe-text preview when collapsed, and a placeholder when empty', () => {
    render(<Harness sessionCount={2} />)
    expect(screen.getByText('No objective set')).toBeInTheDocument()
    const preview = screen.getByText('Do the thing')
    expect(preview).toBeInTheDocument()
    expect(preview.closest('.line-clamp-3')).not.toBeNull()
  })

  it('expands to a read-only view (no inputs), showing full content and Edit/Delete', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={2} />)

    const header = screen.getByText('Session 2').closest('[role="button"]')!
    expect(header).toHaveAttribute('aria-expanded', 'false')

    await user.click(header)

    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Objective (optional)')).not.toBeInTheDocument()
    const panelId = header.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)!
    expect(within(panel).getByText('Do the thing')).toBeInTheDocument()
    expect(within(panel).getByText('Do the thing').closest('.line-clamp-3')).toBeNull()
    expect(screen.getByRole('button', { name: 'Edit session 2' })).toBeInTheDocument()
  })

  it('enforces the single-open rule: opening one row closes the other', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={2} />)

    const header1 = screen.getByText('Session 1').closest('[role="button"]')!
    const header2 = screen.getByText('Session 2').closest('[role="button"]')!

    await user.click(header1)
    expect(header1).toHaveAttribute('aria-expanded', 'true')
    expect(header2).toHaveAttribute('aria-expanded', 'false')

    await user.click(header2)
    expect(header1).toHaveAttribute('aria-expanded', 'false')
    expect(header2).toHaveAttribute('aria-expanded', 'true')
  })

  it('clicking the open header again collapses it', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={1} />)

    const header = screen.getByText('Session 1').closest('[role="button"]')!
    await user.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')

    await user.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports Enter/Space on the header to toggle', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={1} />)

    const header = screen.getByText('Session 1').closest<HTMLElement>('[role="button"]')!
    header.focus()
    await user.keyboard('{Enter}')
    expect(header).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('Edit opens a modal; Save commits and returns to read view, Cancel discards', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={1} />)

    const header = screen.getByText('Session 1').closest('[role="button"]')!
    await user.click(header)
    await user.click(screen.getByRole('button', { name: 'Edit session 1' }))

    let dialog = screen.getByRole('dialog')
    const titleInput = within(dialog).getByLabelText('Title')
    await user.clear(titleInput)
    await user.type(titleInput, 'Changed title')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Session 1')).toBeInTheDocument()
    expect(screen.queryByText('Changed title')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit session 1' }))
    dialog = screen.getByRole('dialog')
    const titleInput2 = within(dialog).getByLabelText('Title')
    await user.clear(titleInput2)
    await user.type(titleInput2, 'Changed title')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Changed title')).toBeInTheDocument()
    // Back to read view for the still-open row, not the form.
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
  })

  it('blocks Add with an empty title, then adds and jumps to the last page', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={6} />)

    await user.click(screen.getByRole('button', { name: /add session/i }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))
    expect(within(dialog).getByText('Session title is required')).toBeInTheDocument()

    await user.type(within(dialog).getByLabelText('Title'), 'Newly added session')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Newly added session')).toBeInTheDocument()
  })

  it('paginates 3 per page, starting on page 1', () => {
    render(<Harness sessionCount={8} />)
    expect(screen.getByText('Session 1')).toBeInTheDocument()
    expect(screen.getByText('Session 3')).toBeInTheDocument()
    expect(screen.queryByText('Session 4')).not.toBeInTheDocument()
  })

  it('search filters by title and resets to page 1', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={8} />)

    await user.click(screen.getByRole('link', { name: 'Go to next page' }))
    expect(screen.getByText('Session 4')).toBeInTheDocument()
    expect(screen.queryByText('Session 1')).not.toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Search sessions by title'), 'Session 7')

    // Back on page 1: the match is visible even though it was on page 3.
    expect(screen.getByText('Session 7')).toBeInTheDocument()
    expect(screen.queryByText('Session 4')).not.toBeInTheDocument()
  })

  it('reorder modal drafts changes and only commits on Save order', async () => {
    const user = userEvent.setup()
    render(<Harness sessionCount={3} />)

    await user.click(screen.getByRole('button', { name: /reorder/i }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Move session 2 up' }))
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    const rowsBefore = screen.getAllByText(/^Session \d$/)
    expect(rowsBefore.map((n) => n.textContent)).toEqual(['Session 1', 'Session 2', 'Session 3'])

    await user.click(screen.getByRole('button', { name: /reorder/i }))
    const dialog2 = screen.getByRole('dialog')
    await user.click(within(dialog2).getByRole('button', { name: 'Move session 2 up' }))
    await user.click(within(dialog2).getByRole('button', { name: 'Save order' }))

    const rowsAfter = screen.getAllByText(/^Session \d$/)
    expect(rowsAfter.map((n) => n.textContent)).toEqual(['Session 2', 'Session 1', 'Session 3'])
  })
})
