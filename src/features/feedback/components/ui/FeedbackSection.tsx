import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useGetProposalFeedback from '../../hooks/useGetProposalFeedback'
import useSubmitFeedback from '../../hooks/useSubmitFeedback'
import { isHiddenFeedback } from '../../store/types'
import { SubmitFeedbackFormData, SubmitFeedbackSchema } from '../../schemas'
import { REVEAL_FALLBACK_DAYS } from '../../constants'
import StarRating from './StarRating'
import StarRatingInput from './StarRatingInput'

interface FeedbackSectionProps {
  proposalId: string
  currentUserId: string
  counterpartId: string
  counterpartName: string
}

function FeedbackSection({
  proposalId,
  currentUserId,
  counterpartId,
  counterpartName,
}: FeedbackSectionProps) {
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

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-3xl" />
  }

  const ownEntry = feedbacks?.find((f) => f.authorId === currentUserId)
  const counterpartEntry = feedbacks?.find((f) => f.authorId === counterpartId)

  const onSubmit: SubmitHandler<SubmitFeedbackFormData> = async (data) => {
    await submitFeedback({ rating: data.rating, comment: data.comment || undefined })
  }

  const errorMessage =
    error instanceof AxiosError ? (error.response?.data?.message as string | undefined) : undefined

  return (
    <div className="space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-6">
      <h3 className="text-xl font-semibold text-[#143681]">Course feedback</h3>

      {/* Your own feedback -- prompt to submit, or show what you already left */}
      {ownEntry && !isHiddenFeedback(ownEntry) ? (
        <div className="rounded-2xl bg-[#F5F6F7] p-4">
          <p className="text-sm font-semibold text-[#143681]">You reviewed {counterpartName}</p>
          <div className="mt-1">
            <StarRating rating={ownEntry.rating} size="sm" />
          </div>
          {ownEntry.comment && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#143681]">{ownEntry.comment}</p>
          )}
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit(onSubmit)(e)
          }}
          noValidate
        >
          <div>
            <Label className="text-sm font-semibold text-[#143681]">
              Leave feedback for {counterpartName}
            </Label>
            <div className="mt-2">
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
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#143681]">Comment (optional)</Label>
            <Textarea
              {...form.register('comment')}
              placeholder={`Share how your experience with ${counterpartName} went…`}
              error={form.formState.errors.comment?.message}
            />
          </div>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Submitting…' : 'Submit feedback'}
          </Button>
        </form>
      )}
      <div className="border-t border-[#E0E2E6] pt-4">
        {!counterpartEntry && (
          <p className="text-sm text-gray-500">
            Waiting for {counterpartName} to leave their feedback.
          </p>
        )}
        {counterpartEntry && isHiddenFeedback(counterpartEntry) && (
          <p className="text-sm text-gray-500">
            Feedback will be revealed once {counterpartName} submits theirs, or within{' '}
            {REVEAL_FALLBACK_DAYS} days of course completion.
          </p>
        )}
        {counterpartEntry && !isHiddenFeedback(counterpartEntry) && (
          <div>
            <p className="text-sm font-semibold text-[#143681]">{counterpartName}'s feedback</p>
            <div className="mt-1">
              <StarRating rating={counterpartEntry.rating} size="sm" />
            </div>
            {counterpartEntry.comment && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#143681]">
                {counterpartEntry.comment}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackSection
