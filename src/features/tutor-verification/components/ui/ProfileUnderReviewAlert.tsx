import { Info } from 'lucide-react'
import { useStore } from '@/store/store'

const ProfileUnderReviewAlert = () => {
  const status = useStore((state) => state.auth.user?.tutorProfile?.verificationStatus)

  if (status !== 'PENDING') return null

  return (
    <div className="flex items-center gap-3 rounded-xl bg-blue-900 px-5 py-3 text-white">
      <Info className="size-6" aria-hidden="true" />
      <p>Your profile is under review. We'll notify you once it's been reviewed.</p>
    </div>
  )
}

export default ProfileUnderReviewAlert
