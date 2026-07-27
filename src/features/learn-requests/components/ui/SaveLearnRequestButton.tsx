import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import useToggleSavedLearnRequest from '../../hooks/useToggleSavedLearnRequest'

type SaveLearnRequestButtonProps = {
  learnRequestId: string
  isSaved: boolean
  className?: string
}

const SaveLearnRequestButton = ({
  learnRequestId,
  isSaved,
  className,
}: SaveLearnRequestButtonProps) => {
  const toggle = useToggleSavedLearnRequest(learnRequestId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle.mutate(isSaved)
      }}
      aria-label={isSaved ? 'Unsave this request' : 'Save this request'}
      aria-pressed={isSaved}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-full border border-[#2563EB] p-2 text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white',
        className
      )}
    >
      <Heart className={cn('size-5', isSaved && 'fill-current')} />
    </button>
  )
}

export default SaveLearnRequestButton
