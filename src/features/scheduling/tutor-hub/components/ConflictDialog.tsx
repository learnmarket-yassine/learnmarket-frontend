import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { TriangleAlert } from 'lucide-react'
import type { AvailabilityConflictPayload } from '../../types/dto'
import { formatDateLabel, formatSlotTime } from '../../utils/time'

interface ConflictDialogProps {
  conflict: AvailabilityConflictPayload | null
  onClose: () => void
  timezone: string
}

const ConflictDialog = ({ conflict, onClose, timezone }: ConflictDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const open = conflict !== null

  const body = conflict && (
    <div className="flex flex-col gap-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>This change conflicts with confirmed sessions</AlertTitle>
        <AlertDescription>{conflict.message}</AlertDescription>
      </Alert>

      <div className="flex flex-col gap-2">
        {conflict.affectedSessions.map((session) => (
          <Card key={session.bookingId} size="sm">
            <CardContent className="flex flex-col gap-0.5">
              <span className="font-medium">{formatDateLabel(session.startTime, timezone)}</span>
              <span className="text-sm text-muted-foreground">
                {formatSlotTime(session.startTime, timezone)} –{' '}
                {formatSlotTime(session.endTime, timezone)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const footer = (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button variant="outline" disabled className="w-full sm:w-auto">
              Continue anyway
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Overriding this conflict needs a backend force-override endpoint that doesn&apos;t exist
          yet.
        </TooltipContent>
      </Tooltip>
      <Button onClick={onClose} className="w-full sm:w-auto">
        Keep as-is
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conflict detected</DialogTitle>
          </DialogHeader>
          {body}
          <DialogFooter>{footer}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Conflict detected</SheetTitle>
        </SheetHeader>
        <div className="px-4">{body}</div>
        <SheetFooter>{footer}</SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ConflictDialog
