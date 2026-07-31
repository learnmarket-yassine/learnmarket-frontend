import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useGetProposalFeedback from '../../hooks/useGetProposalFeedback'
import useSubmitFeedback from '../../hooks/useSubmitFeedback'
import { SubmitFeedbackFormData, SubmitFeedbackSchema } from '../../schemas'
import StarRating from './StarRating'
import StarRatingInput from './StarRatingInput'
import FeedbackIcon from '@/assets/FeedbackIcon'
import { Star, AlertCircle } from 'lucide-react'

interface LeaveFeedbackButtonProps {
  proposalId: string
  currentUserId: string
  counterpartId: string
  counterpartName: string
}

function LeaveFeedbackButton({
  proposalId,
  currentUserId,
  counterpartId,
  counterpartName,
}: LeaveFeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: feedbacks, isLoading } = useGetProposalFeedback(proposalId)
  const {
    handleSubmit: submitFeedback,
    isPending,
    error,
  } = useSubmitFeedback(proposalId, counterpartId)

  const form = useForm<SubmitFeedbackFormData>({
    resolver: zodResolver(SubmitFeedbackSchema),
    defaultValues: { rating: 0, comment: '' },
  })

  const ownEntry = feedbacks?.find((f) => f.authorId === currentUserId)

  const onSubmit: SubmitHandler<SubmitFeedbackFormData> = async (data) => {
    await submitFeedback({ rating: data.rating, comment: data.comment || undefined })
    setIsOpen(false)
  }

  const errorMessage =
    error instanceof AxiosError ? (error.response?.data?.message as string | undefined) : undefined

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-[#2563EB] px-5 font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white"
        >
          <Star className="mr-2 size-4" />
          {isLoading ? 'Feedback' : ownEntry ? 'View feedback' : 'Leave feedback'}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[400px] flex-col justify-center sm:max-w-[335px] lg:max-w-[400px]">
        {/* Shared header band, same visual language as ViewFeedbackButton */}
        <DialogHeader className="text-left">
          <DialogTitle className="flex justify-center">
            <FeedbackIcon />
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="text-center text-3xl font-semibold">
              {isLoading
                ? 'Feedback'
                : ownEntry
                  ? `Your feedback for ${counterpartName}`
                  : `Leave feedback for ${counterpartName}`}
              {!isLoading && !ownEntry && (
                <p className="text-sm text-[#6B7280]">
                  Your honest feedback helps {counterpartName} and future learners.
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-5">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-9 w-40 rounded-full" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          )}
          {!isLoading && ownEntry && (
            <div className="flex flex-col items-center space-y-4">
              <StarRating size="xl" rating={ownEntry.rating} />
              {ownEntry.comment ? (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                  <p className="whitespace-pre-wrap leading-7 text-[#374151]">
                    "{ownEntry.comment}"
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-[#6B7280]">You didn't leave a written comment.</p>
              )}
            </div>
          )}

          {!isLoading && !ownEntry && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onSubmit)(e)
              }}
              noValidate
            >
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#F8FAFC] py-5">
                <Label className="text-sm font-semibold text-[#143681]">
                  How was your experience?
                </Label>
                <Controller
                  name="rating"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <StarRatingInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#143681]">Comment (optional)</Label>
                <Textarea
                  {...form.register('comment')}
                  className="min-h-[100px] resize-none rounded-2xl"
                  placeholder={`Share how your experience with ${counterpartName} went…`}
                  error={form.formState.errors.comment?.message}
                />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="h-full w-full rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Submitting…' : 'Submit feedback'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveFeedbackButton
