import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ShieldQuestion } from 'lucide-react'
import { useStore } from '@/store/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import useSubmitForVerification from '../../hooks/useSubmitForVerification'
import CheckListItem from './CheckListItem'

type VerificationStatus = 'UNSUBMITTED' | 'PENDING' | 'REJECTED' | 'REVOKED'

interface StatusContent {
  icon: React.ReactNode
  title: string
  description: string
  showChecklist: boolean
  primaryAction: { label: string; onClick: () => void; disabled?: boolean } | null
}

interface TutorVerificationModalProps {
  children?: React.ReactNode
}

const TutorVerificationModal = ({ children }: TutorVerificationModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useStore((state) => state.auth.user)
  const submitForVerification = useSubmitForVerification()

  const status = (user?.tutorProfile?.verificationStatus ?? undefined) as
    VerificationStatus | 'APPROVED' | undefined

  if (!user || !status || status === 'APPROVED') return null

  const hasBio = !!user.bio?.trim()
  const hasSpecialty = (user.tutorProfile?.specialties.length ?? 0) > 0
  const hasCertification = (user.tutorProfile?.certifications.length ?? 0) > 0
  const isComplete = hasBio && hasSpecialty && hasCertification
  const reviewNote = user.tutorProfile?.reviewNote

  const STATUS_CONTENT: Record<VerificationStatus, StatusContent> = {
    UNSUBMITTED: {
      icon: <ShieldQuestion className="size-10 text-[#2563EB]" aria-hidden="true" />,
      title: 'Complete verification to start proposing',
      description: 'You need an approved profile before you can submit proposals to learners.',
      showChecklist: true,
      primaryAction: {
        label: submitForVerification.isPending ? 'Submitting…' : 'Submit for Verification',
        onClick: () => submitForVerification.mutate(),
        disabled: !isComplete || submitForVerification.isPending,
      },
    },
    PENDING: {
      icon: <ShieldQuestion className="size-10 text-[#2563EB]" aria-hidden="true" />,
      title: 'Your profile is under review',
      description: "No action needed — we'll notify you once it's been reviewed.",
      showChecklist: false,
      primaryAction: null,
    },
    REJECTED: {
      icon: <ShieldAlert className="size-10 text-destructive" aria-hidden="true" />,
      title: 'Your submission was rejected',
      description: 'Review the feedback below, then update your profile and resubmit.',
      showChecklist: true,
      primaryAction: {
        label: submitForVerification.isPending ? 'Resubmitting…' : 'Resubmit',
        onClick: () => submitForVerification.mutate(),
        disabled: !isComplete || submitForVerification.isPending,
      },
    },
    REVOKED: {
      icon: <ShieldAlert className="size-10 text-destructive" aria-hidden="true" />,
      title: 'Your verification was revoked',
      description: 'Review the feedback below, then update your profile and resubmit.',
      showChecklist: true,
      primaryAction: {
        label: submitForVerification.isPending ? 'Resubmitting…' : 'Resubmit',
        onClick: () => submitForVerification.mutate(),
        disabled: !isComplete || submitForVerification.isPending,
      },
    },
  }

  const content = STATUS_CONTENT[status]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <p className="cursor-pointer text-sm font-medium text-[#225AD6] underline">
            Verify your identity
          </p>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogDescription className="flex flex-col gap-3 text-[#2C2C2C]">
            <span className="text-2xl font-semibold text-[#143681]">{content.title}</span>
            <span className="text-sm text-muted-foreground">{content.description}</span>
          </DialogDescription>
        </DialogHeader>

        {reviewNote && (status === 'REJECTED' || status === 'REVOKED') && (
          <Alert variant="destructive" className="w-full text-left">
            <AlertTitle>Reviewer feedback</AlertTitle>
            <AlertDescription>{reviewNote}</AlertDescription>
          </Alert>
        )}

        {content.showChecklist && (
          <ul className="w-full space-y-2 py-2 text-left">
            <CheckListItem label="Bio" met={hasBio} />
            <CheckListItem label="At least one specialty" met={hasSpecialty} />
            <CheckListItem label="At least one certification" met={hasCertification} />
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          {content.primaryAction && (
            <Button
              type="button"
              variant="default"
              className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
              disabled={content.primaryAction.disabled}
              onClick={content.primaryAction.onClick}
            >
              {content.primaryAction.label}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TutorVerificationModal
