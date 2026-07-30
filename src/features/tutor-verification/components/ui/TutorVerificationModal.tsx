import { useState } from 'react'
import { useStore } from '@/store/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useSubmitForVerification from '../../hooks/useSubmitForVerification'
import CertificationImage from '@/assets/CertificationImage'
import CheckListItem from './CheckListItem'
import { BadgeCheck } from 'lucide-react'

const TutorVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useStore((state) => state.auth.user)
  const submitForVerification = useSubmitForVerification()

  const status = user?.tutorProfile?.verificationStatus

  if (!user || (status !== 'UNSUBMITTED' && status !== 'REJECTED')) return null

  const reviewNote = user.tutorProfile?.reviewNote
  const hasBio = !!user.bio?.trim()
  const hasSpecialty = (user.tutorProfile?.specialties.length ?? 0) > 0
  const hasCertification = (user.tutorProfile?.certifications.length ?? 0) > 0
  const isComplete = hasBio && hasSpecialty && hasCertification

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-[#225AD6] underline"
        >
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          <span>Verify your identity</span>
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[400px] flex-col justify-center sm:max-w-[335px] lg:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <CertificationImage />
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="py-2 text-center text-3xl font-semibold">
              Complete verification to start proposing
            </div>
          </DialogDescription>
        </DialogHeader>
        {status === 'REJECTED' && reviewNote && (
          <div className="verification-scroll max-h-32 overflow-y-auto rounded-lg border bg-red-100 px-4 py-3 text-sm text-red-700">
            <p className="font-semibold">Reason for rejection</p>
            <p className="break-words">{reviewNote}</p>
          </div>
        )}
        <div>
          <CheckListItem
            label="Professional Bio"
            description="A compelling summary of your teaching philosophy."
            met={hasBio}
          />
          <CheckListItem
            label="Subject Specialties"
            description="A compelling specialities of your teaching subjects."
            met={hasSpecialty}
          />
          <CheckListItem
            label="Professional Bio"
            description="Upload valid certifications credentials or degree copies."
            met={hasCertification}
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
            disabled={!isComplete || submitForVerification.isPending}
            onClick={() => submitForVerification.mutate()}
          >
            {submitForVerification.isPending ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TutorVerificationModal
