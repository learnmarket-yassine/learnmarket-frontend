import NoResults from '@/components/ui/NoResults'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { cn } from '@/lib/utils'
import TutorLearningRequestCard from './TutorLearningRequestCard'
import LearningRequestDetailsSheet from './LearningRequestDetailsSheet'
import { useEffect, useState } from 'react'
import Loader from '@/components/ui/Loader/Loader'

type TutorLearningRequestListProps = {
  learnRequests: LearnRequest[]
  isError?: boolean
  isLoading?: boolean
  isPlaceholderData?: boolean
  emptyMessage?: string
}

const TutorLearningRequestList = ({
  learnRequests,
  isError,
  isLoading,
  isPlaceholderData,
  emptyMessage,
}: TutorLearningRequestListProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const selectedRequest = learnRequests.find((request) => request.id === selectedId) ?? null

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isSheetOpen && !selectedRequest) setIsSheetOpen(false)
  }, [isSheetOpen, selectedRequest])

  if (isLoading) return <Loader className="flex h-full w-full items-center justify-center" />

  if (isError || learnRequests.length <= 0)
    return (
      <div>
        {!isError && emptyMessage ? (
          <p className="py-10 text-center text-sm text-[#6B7280]">{emptyMessage}</p>
        ) : (
          <NoResults />
        )}
      </div>
    )

  return (
    <div>
      <div className={cn('space-y-4 transition-opacity', isPlaceholderData && 'opacity-60')}>
        {learnRequests.map((learnRequest) => (
          <TutorLearningRequestCard
            onSelect={() => {
              setSelectedId(learnRequest.id)
              setIsSheetOpen(true)
            }}
            key={learnRequest.id}
            learnRequest={learnRequest}
          />
        ))}
      </div>
      <LearningRequestDetailsSheet
        request={selectedRequest}
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
      />
    </div>
  )
}

export default TutorLearningRequestList
