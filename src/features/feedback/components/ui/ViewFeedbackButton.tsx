import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useGetProposalFeedback from '../../hooks/useGetProposalFeedback'
import StarRating from './StarRating'
import { Eye } from 'lucide-react'
import FeedbackIcon from '@/assets/FeedbackIcon'

interface ViewFeedbackButtonProps {
  proposalId: string
  counterpartId: string
  counterpartName: string
}

function ViewFeedbackButton({
  proposalId,
  counterpartId,
  counterpartName,
}: ViewFeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: feedbacks } = useGetProposalFeedback(proposalId)
  const learnerFeedback = feedbacks?.find((f) => f.authorId === counterpartId)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-[#2563EB] px-5 font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white"
        >
          <Eye className="mr-2 size-4" />
          View Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[400px] flex-col justify-center sm:max-w-[335px] lg:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <FeedbackIcon />
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="text-center text-3xl font-semibold">{counterpartName}'s feedback</div>
          </DialogDescription>
        </DialogHeader>
        {learnerFeedback ? (
          <div className="flex flex-col items-center space-y-4">
            <StarRating size="xl" rating={learnerFeedback.rating} />
            {learnerFeedback.comment && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                <p className="whitespace-pre-wrap leading-7 text-[#374151]">
                  "{learnerFeedback.comment}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {counterpartName} hasn't left feedback for this course yet.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewFeedbackButton
