import { useEffect, useRef, useState } from 'react'
import { useConfirmHold } from './useConfirmHold'
import { findActionableSessions } from '../utils/sessions'
import { Session, SlotHold } from '../types/dto'
import { useReleaseHold } from './useReleaseHold'
import { isHoldStillActive } from '../utils/holds'

export type BookingFlowState = { step: 'selecting' } | { step: 'holding'; hold: SlotHold }

const SELECTING: BookingFlowState = { step: 'selecting' }

export function useBookingFlow(sessions: Session[]) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(
    () => findActionableSessions(sessions)[0]?.id
  )
  const [state, setState] = useState<BookingFlowState>(SELECTING)

  const {
    handleConfirmHold,
    isPending: isConfirmHoldPending,
    modalState,
    handleCloseModal,
  } = useConfirmHold()

  const releaseHold = useReleaseHold()

  const latestRef = useRef({ state, releaseHold })
  useEffect(() => {
    latestRef.current = { state, releaseHold }
  })

  const actionableSessions = findActionableSessions(sessions)
  const activeSession =
    actionableSessions.find((session) => session.id === selectedSessionId) ?? actionableSessions[0]

  const selectSlot = (hold: SlotHold) => setState({ step: 'holding', hold })

  const backToSelecting = () => setState(SELECTING)

  const selectSession = (sessionId: string) => {
    if (sessionId === selectedSessionId) return

    if (state.step === 'holding') {
      releaseHold.mutate(state.hold.id)
    }
    setSelectedSessionId(sessionId)

    const session = sessions.find((s) => s.id === sessionId)
    const hold = session?.slotHold
    if (session?.status === 'HELD' && hold && isHoldStillActive(hold)) {
      setState({ step: 'holding', hold })
    } else {
      backToSelecting()
    }
  }

  const confirm = async () => {
    if (state.step !== 'holding') return
    const attemptedHoldId = state.hold.id
    try {
      await handleConfirmHold(attemptedHoldId)
    } catch {
      /* empty */
    } finally {
      setState((current) =>
        current.step === 'holding' && current.hold.id === attemptedHoldId ? SELECTING : current
      )
    }
  }

  const chooseDifferentTime = () => {
    if (state.step === 'holding') releaseHold.mutate(state.hold.id)
    backToSelecting()
  }

  useEffect(() => {
    return () => {
      const latest = latestRef.current
      if (latest.state.step === 'holding') {
        latest.releaseHold.mutate(latest.state.hold.id)
      }
    }
  }, [])

  return {
    state,
    activeSession,
    isConfirming: isConfirmHoldPending,
    selectSession,
    selectSlot,
    confirm,
    chooseDifferentTime,
    backToSelecting,
    modalState,
    handleCloseModal,
  }
}
