import { Badge } from '@/components/ui/badge'
import HeadlineForm from '../ui/HeadLineForm'
import OverviewForm from '../ui/OverviewForm'
import LearnerInterestsForm from '../ui/LearnerInterestsForm'
import { AuthUser } from '@/features/auth/store/types'

interface LearnerProfileMainContentProps {
  myProfile: AuthUser
}

function LearnerProfileMainContent({ myProfile }: LearnerProfileMainContentProps) {
  return (
    <div className="flex flex-col divide-y-[0.5px] divide-[#E0E2E6] border-l border-l-[#E0E2E6] bg-white">
      {/* Headline */}
      <div>
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <h2 className="max-w-4xl flex-1 text-2xl font-semibold leading-snug text-[#143681]">
              {myProfile.headline}
            </h2>
            <div>
              <HeadlineForm />
            </div>
          </div>
        </div>
        {/* Bio */}
        <div className="relative p-8">
          <div className="absolute right-4 top-4">
            <OverviewForm />
          </div>
          <p className="max-w-5xl whitespace-pre-wrap break-words pr-5 text-xl text-[#143681]">
            {myProfile.bio}
          </p>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-5 p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#143681]">Interests</h3>
          <LearnerInterestsForm />
        </div>
        <div className="flex flex-wrap gap-2">
          {myProfile.learnerProfile?.interests.map((interest) => (
            <Badge
              key={interest.id}
              variant="secondary"
              className="h-9 rounded-lg border-none bg-[#F5F6F7] px-4 py-2 text-sm text-[#102A63]"
            >
              {interest.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
export default LearnerProfileMainContent
