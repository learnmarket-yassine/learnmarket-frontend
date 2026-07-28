import { BadgeCheck, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import AvatarImg from '@/assets/images/avatar.png'
import { AuthUser } from '@/features/auth/store/types'
import { getAssetUrl } from '@/lib/utils'
import VerifiedBadge from '@/features/tutor-verification/components/ui/VerifiedBadge'
import TutorVerificationModal from '@/features/tutor-verification/components/ui/TutorVerificationModal'

interface ProfileHeaderProps {
  profile: AuthUser
}

function MyProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = `${profile.firstname} ${profile.lastname}`
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-start justify-between gap-4 p-8">
      {/* Left: avatar + info */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0 after:border-none">
          <AvatarImage src={getAssetUrl(profile.avatar) || AvatarImg} alt={initials} />
          <AvatarFallback className="bg-blue-600 text-lg font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#143681]">
              {profile.firstname} {profile.lastname}
            </h1>
            {profile.tutorProfile?.verificationStatus && (
              <div className="flex items-center gap-1">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                <TutorVerificationModal />
              </div>
            )}
            <VerifiedBadge status={profile?.tutorProfile?.verificationStatus} />
          </div>
          <div className="flex flex-wrap items-center gap-1 text-base text-[#143681]">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.country}
            </span>
            <span>-</span>
            <span className="flex items-center gap-1">
              {new Date().toLocaleTimeString('en-US', {
                timeZone: 'UTC',
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              UTC
            </span>
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="default"
          className="h-12 rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white hover:bg-[#2563EB]/90"
        >
          See public view
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-full border-[#2563EB] bg-white px-6 py-3 text-base font-semibold text-[#2563EB] hover:bg-white/90 hover:text-[#2563EB]/90"
        >
          Share
        </Button>
      </div>
    </div>
  )
}
export default MyProfileHeader
