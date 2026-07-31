import { Badge } from '@/components/ui/badge'
import HeadlineForm from '../ui/HeadLineForm'
import PortfolioForm from '../ui/PortfolioForm'
import PortfolioList from '../ui/PortfolioList'
import OverviewForm from '../ui/OverviewForm'
import { AuthUser } from '@/features/auth/store/types'
import SkillsForm from '../ui/SkillsForm'
import SpecialtiesForm from '../ui/SpecialtiesForm'

interface MyProfileMainContentProps {
  myProfile: AuthUser
  readOnly?: boolean
}

function MyProfileMainContent({ myProfile, readOnly = false }: MyProfileMainContentProps) {
  return (
    <div className="flex flex-col divide-y-[0.5px] divide-[#E0E2E6] border-l border-l-[#E0E2E6] bg-white">
      {/* Headline + rate */}
      <div>
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <h2 className="max-w-4xl flex-1 text-2xl font-semibold leading-snug text-[#143681]">
              {myProfile.headline}
            </h2>
            {!readOnly && (
              <div>
                <HeadlineForm />
              </div>
            )}
          </div>
        </div>
        {/* Bio */}

        <div className="relative p-8">
          {!readOnly && (
            <div className="absolute right-4 top-4">
              <OverviewForm />
            </div>
          )}
          <p className="max-w-5xl whitespace-pre-wrap break-words pr-5 text-xl text-[#143681]">
            {myProfile.bio}
          </p>
        </div>
      </div>

      {/* Portfolio */}
      {(!readOnly || (myProfile.tutorProfile?.portfolio ?? []).length > 0) && (
        <div className="space-y-5 p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-[#143681]">Portfolio</h3>
            {!readOnly && <PortfolioForm edit={false} />}
          </div>
          <PortfolioList portfolio={myProfile.tutorProfile?.portfolio ?? []} readOnly={readOnly} />
        </div>
      )}

      {/* Specialties */}
      {(!readOnly || (myProfile.tutorProfile?.specialties ?? []).length > 0) && (
        <div className="space-y-5 p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-[#143681]">Specialties</h3>
            {!readOnly && <SpecialtiesForm />}
          </div>
          <div className="flex flex-wrap gap-2">
            {myProfile.tutorProfile?.specialties.map((specialty) => (
              <Badge
                key={specialty.id}
                variant="secondary"
                className="h-9 rounded-lg border-none bg-[#F5F6F7] px-4 py-2 text-sm text-[#102A63]"
              >
                {specialty.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(!readOnly || (myProfile.tutorProfile?.skills ?? []).length > 0) && (
        <div className="space-y-5 p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-[#143681]">Skills</h3>
            {!readOnly && <SkillsForm />}
          </div>
          <div className="flex flex-wrap gap-2">
            {myProfile.tutorProfile?.skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="h-9 rounded-lg border-none bg-[#F5F6F7] px-4 py-2 text-sm text-[#102A63]"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default MyProfileMainContent
