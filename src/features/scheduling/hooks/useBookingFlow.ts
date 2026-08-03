import { useEffect, useRef, useState } from 'react'
import { useConfirmHold } from './useConfirmHold'
import { Session, SlotHold } from '../types/dto'
import { useReleaseHold } from './useReleaseHold'
import { isHoldStillActive } from '../utils/holds'

export type BookingFlowState = { step: 'selecting' } | { step: 'holding'; hold: SlotHold }

const SELECTING: BookingFlowState = { step: 'selecting' }

export function useBookingFlow(session: Session) {
  const [state, setState] = useState<BookingFlowState>(() => {
    const hold = session.slotHold

    if (session.status === 'HELD' && hold && isHoldStillActive(hold)) {
      return {
        step: 'holding',
        hold,
      }
    }

    return SELECTING
  })

  const {
    handleConfirmHold,
    isPending: isConfirmHoldPending,
    modalState,
    handleCloseModal,
  } = useConfirmHold()

  const releaseHold = useReleaseHold()

  const latestRef = useRef({ state, releaseHold })

  useEffect(() => {
    latestRef.current = {
      state,
      releaseHold,
    }
  }, [state, releaseHold])

  const selectSlot = (hold: SlotHold) => {
    setState({
      step: 'holding',
      hold,
    })
  }

  const backToSelecting = () => {
    setState(SELECTING)
  }

  const confirm = async () => {
    if (state.step !== 'holding') return

    const attemptedHoldId = state.hold.id

    try {
      await handleConfirmHold(attemptedHoldId)
    } finally {
      setState((current) =>
        current.step === 'holding' && current.hold.id === attemptedHoldId ? SELECTING : current
      )
    }
  }

  const chooseDifferentTime = () => {
    if (state.step === 'holding') {
      releaseHold.mutate(state.hold.id)
    }

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
    isConfirming: isConfirmHoldPending,
    selectSlot,
    confirm,
    chooseDifferentTime,
    backToSelecting,
    modalState,
    handleCloseModal,
  }
}
