import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { useState } from 'react'
import { Booking } from '../../types/dto'
import { getBrowserTimezone } from '../../utils/timezones'
import { formatDateLabel, formatSlotTime } from '../../utils/time'
import { isHoldExpiredError, isSlotTakenError } from '../../utils/errors'

const confirmHold = async (api: AxiosInstance, holdId: string): Promise<Booking> => {
  const response = await api.post(`/holds/${holdId}/confirm`)
  return response.data
}

type ModalState = {
  isOpen: boolean
  type: 'success' | 'error'
  title: string
  description: string
}

const ERROR_COPY: Record<'timeout' | 'taken' | 'error', { title: string; description: string }> = {
  timeout: {
    title: 'Your hold expired',
    description: 'This time slot is no longer reserved for you. Please pick another time.',
  },
  taken: {
    title: 'This slot was just taken',
    description: 'Someone else booked this time first. Please choose a different slot.',
  },
  error: {
    title: 'Something went wrong',
    description: 'Unable to confirm your booking. Please try again.',
  },
}

export function useConfirmHold() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    description: '',
  })

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const confirmHoldMutation = useMutation({
    mutationFn: (holdId: string) => confirmHold(axiosPrivate, holdId),
    onSuccess: async (booking) => {
      const timezone = getBrowserTimezone()
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Your reservation has been confirmed.',
        description: `Your reservation on ${formatDateLabel(booking.startTime, timezone)} from ${formatSlotTime(booking.startTime, timezone)} to ${formatSlotTime(booking.endTime, timezone)} has been confirmed.`,
      })
      await queryClient.invalidateQueries({ queryKey: ['proposal'] })
    },
    onError: (error) => {
      const reason = isHoldExpiredError(error)
        ? 'timeout'
        : isSlotTakenError(error)
          ? 'taken'
          : 'error'
      setModalState({ isOpen: true, type: 'error', ...ERROR_COPY[reason] })
    },
  })

  return {
    handleConfirmHold: confirmHoldMutation.mutateAsync,
    isPending: confirmHoldMutation.isPending,
    modalState,
    handleCloseModal,
  }
}
