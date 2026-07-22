import NoResults from '@/components/ui/NoResults'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { cn } from '@/lib/utils'
import TutorLearningRequestCard from './TutorLearningRequestCard'
import LearningRequestDetailsSheet from './LearningRequestDetailsSheet'
import { useState } from 'react'

type TutorLearningRequestListProps = {
  learnRequests: LearnRequest[]
  isError?: boolean
  isLoading?: boolean
  isPlaceholderData?: boolean
}

const TutorLearningRequestList = ({
  learnRequests,
  isError,
  isLoading,
  isPlaceholderData,
}: TutorLearningRequestListProps) => {
  const [selectedRequest, setSelectedRequest] = useState<LearnRequest | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  if (isLoading) return <p>...loading</p>

  if (isError || learnRequests.length <= 0)
    return (
      <div>
        <NoResults />
      </div>
    )

  return (
    <div>
      <div className={cn('space-y-4 transition-opacity', isPlaceholderData && 'opacity-60')}>
        {learnRequests.map((learnRequest) => (
          <TutorLearningRequestCard
            onSelect={() => {
              setSelectedRequest(learnRequest)
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
