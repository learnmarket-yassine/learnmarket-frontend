import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import SessionReviewGate from '@/features/sessions/components/ui/LearnerResponsePanel'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import type { Session } from '../../types/dto'

interface RespondSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
}

const RespondSessionModal = ({ open, onOpenChange, session }: RespondSessionModalProps) => {
  const { data: context, isLoading } = useGetSessionContext(session.id, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[560px] flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#143681]">{session.title}</DialogTitle>
        </DialogHeader>

        {isLoading || !context ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : (
          <SessionReviewGate sessionId={session.id} context={context} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default RespondSessionModal
