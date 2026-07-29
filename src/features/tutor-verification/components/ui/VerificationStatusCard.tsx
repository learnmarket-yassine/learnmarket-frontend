import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AuthUser } from '@/features/auth/store/types'
import useSubmitForVerification from '../../hooks/useSubmitForVerification'
import VerifiedBadge from './VerifiedBadge'
import CheckListItem from './CheckListItem'

interface VerificationStatusCardProps {
  profile: AuthUser
}

function VerificationStatusCard({ profile }: VerificationStatusCardProps) {
  const submitForVerification = useSubmitForVerification()
  const status = profile.tutorProfile?.verificationStatus ?? 'UNSUBMITTED'

  const hasBio = !!profile.bio?.trim()
  const hasSpecialty = (profile.tutorProfile?.specialties.length ?? 0) > 0
  const hasCertification = (profile.tutorProfile?.certifications.length ?? 0) > 0
  const isComplete = hasBio && hasSpecialty && hasCertification

  if (status === 'APPROVED') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-[#D1D5DA] p-8">
        <ShieldCheck className="size-8 text-[#2563EB]" aria-hidden="true" />
        <div>
          <VerifiedBadge status={status} />
        </div>
      </div>
    )
  }

  if (status === 'PENDING') {
    return (
      <div className="rounded-lg border border-[#D1D5DA] p-8">
        <div className="flex items-center gap-3">
          <ShieldQuestion className="size-8 text-[#2563EB]" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold text-[#143681]">Your profile is under review</p>
            <p className="text-sm text-muted-foreground">
              No action needed — we'll notify you once it's been reviewed.
            </p>
          </div>
        </div>
        {profile.tutorProfile?.reviewNote && (
          <Alert className="mt-4">
            <AlertTitle>Your previous submission was rejected</AlertTitle>
            <AlertDescription>{profile.tutorProfile.reviewNote}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  if (status === 'REJECTED' || status === 'REVOKED') {
    return (
      <div className="rounded-lg border border-[#D1D5DA] p-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="size-8 text-destructive" aria-hidden="true" />
          <p className="text-lg font-semibold text-[#143681]">
            {status === 'REJECTED'
              ? 'Your submission was rejected'
              : 'Your verification was revoked'}
          </p>
        </div>
        {profile.tutorProfile?.reviewNote && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{profile.tutorProfile.reviewNote}</AlertDescription>
          </Alert>
        )}
        <ul className="mt-4 space-y-2">
          <CheckListItem label="Bio" met={hasBio} />
          <CheckListItem label="At least one specialty" met={hasSpecialty} />
          <CheckListItem label="At least one certification" met={hasCertification} />
        </ul>
        <Button
          type="button"
          className="mt-4"
          disabled={!isComplete || submitForVerification.isPending}
          onClick={() => submitForVerification.mutate()}
        >
          {submitForVerification.isPending ? 'Resubmitting…' : 'Resubmit'}
        </Button>
      </div>
    )
  }

  // UNSUBMITTED
  return (
    <div className="rounded-lg border border-[#D1D5DA] p-8">
      <p className="text-lg font-semibold text-[#143681]">Get verified</p>
      <p className="text-sm text-muted-foreground">
        Complete the following before submitting your profile for review.
      </p>
      <ul className="mt-4 space-y-2">
        <CheckListItem label="Bio" met={hasBio} />
        <CheckListItem label="At least one specialty" met={hasSpecialty} />
        <CheckListItem label="At least one certification" met={hasCertification} />
      </ul>
      <Button
        type="button"
        className="mt-4"
        disabled={!isComplete || submitForVerification.isPending}
        onClick={() => submitForVerification.mutate()}
      >
        {submitForVerification.isPending ? 'Submitting…' : 'Submit for Verification'}
      </Button>
    </div>
  )
}

export default VerificationStatusCard
