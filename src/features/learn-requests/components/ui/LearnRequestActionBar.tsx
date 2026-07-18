import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LearnRequest } from '../../store/types'
import useDeleteLearnRequest from '../../hooks/useDeleteLearnRequest'
import useCancelLearnRequest from '../../hooks/useCancelLearnRequest'
import ConfirmModal from '@/components/layout/ConfirmModal'

type Props = {
  request: LearnRequest
}

const CANCELLED_REMOVED_NOTE: Record<string, string> = {
  CANCELLED: 'This request was cancelled and can no longer be edited.',
  REMOVED: 'This request was removed and is no longer visible to tutors.',
}

const LearnRequestActionBar = ({ request }: Props) => {
  const navigate = useNavigate()
  const [confirmAction, setConfirmAction] = useState<'delete' | 'cancel' | null>(null)

  const deleteRequest = useDeleteLearnRequest()
  const cancelRequest = useCancelLearnRequest()

  const handleDelete = async () => {
    await deleteRequest.mutateAsync(request.id)
    setConfirmAction(null)
    navigate('/learning-requests')
  }

  const handleCancel = async () => {
    await cancelRequest.mutateAsync(request.id)
    setConfirmAction(null)
  }

  if (request.status === 'CANCELLED' || request.status === 'REMOVED') {
    return (
      <div className="w-full rounded-xl bg-[#F3F4F6] px-6 py-4 text-center text-sm text-[#6B7280]">
        {CANCELLED_REMOVED_NOTE[request.status]}
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-between gap-6">
      {request.status === 'DRAFT' && (
        <>
          <button
            onClick={() => setConfirmAction('delete')}
            className="w-full flex-1 whitespace-nowrap rounded-xl bg-[#d0d0d0] px-6 py-3 font-medium text-black"
          >
            Delete draft
          </button>
          <button
            type="button"
            className="w-full flex-1 whitespace-nowrap rounded-xl bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
            onClick={() => navigate(`/learn-request/edit/${request.id}`)}
          >
            Continue editing
          </button>
          <ConfirmModal
            type="delete"
            name="Event Exception Modal"
            isOpen={confirmAction === 'delete'}
            setIsOpen={(open) => setConfirmAction(open ? 'delete' : null)}
            title="Delete this draft?"
            description="This draft will be permanently deleted and can't be recovered."
            isLoading={deleteRequest.isPending}
            handleConfirm={handleDelete}
          />
        </>
      )}

      {request.status === 'OPEN' && (
        <>
          <button
            type="button"
            className={
              'w-full flex-1 whitespace-nowrap rounded-xl bg-[#d0d0d0] px-6 py-3 font-medium text-black'
            }
            onClick={() => setConfirmAction('cancel')}
          >
            Cancel request
          </button>
          <button
            type="button"
            className="w-full flex-1 whitespace-nowrap rounded-xl bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]"
            disabled
          >
            Preview as tutor
          </button>
          <ConfirmModal
            name="Event Exception Modal"
            type="delete"
            isOpen={confirmAction === 'cancel'}
            setIsOpen={(open) => setConfirmAction(open ? 'cancel' : null)}
            title="Cancel this request?"
            description="Tutors will no longer be able to see or apply to this request."
            isLoading={cancelRequest.isPending}
            handleConfirm={handleCancel}
          />
        </>
      )}

      {request.status === 'CLOSED' && (
        <>
          <button
            type="button"
            className={
              'w-full flex-1 whitespace-nowrap rounded-xl bg-[#d0d0d0] px-6 py-3 font-medium text-black'
            }
            disabled
          >
            Message tutor
          </button>
          <button
            type="button"
            className={
              'w-full flex-1 whitespace-nowrap rounded-xl bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]'
            }
            disabled
          >
            View sessions
          </button>
        </>
      )}
    </div>
  )
}

export default LearnRequestActionBar
