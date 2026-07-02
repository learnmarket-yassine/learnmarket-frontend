import { MapPin, BadgeCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TutorProfile } from '../../store/types'
import AvatarImg from '@/assets/images/avatar.png'

interface ProfileHeaderProps {
  profile: TutorProfile
}

function MyProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name
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
          <AvatarImage src={AvatarImg} alt={profile.name} />
          <AvatarFallback className="bg-blue-600 text-lg font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#143681]">{profile.name}</h1>
            {profile.isVerified && (
              <BadgeCheck className="h-5 w-5 text-[#102A63]" aria-label="Identity verified" />
            )}
            <a href="#verify" className="text-sm text-[#225AD6] underline underline-offset-2">
              Verify your identity
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-base text-[#143681]">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.location}
            </span>
            <span>-</span>
            <span className="flex items-center gap-1">{profile.localTime}</span>
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
