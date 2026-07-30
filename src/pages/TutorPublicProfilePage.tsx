import { Link, useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import AvatarImg from '@/assets/images/avatar.png'
import { getAssetUrl } from '@/lib/utils'
import { languageLevelLabels } from '@/lib/Constants'
import VerifiedBadge from '@/features/tutor-verification/components/ui/VerifiedBadge'
import useGetPublicTutorProfile from '@/features/tutor-public-profile/hooks/useGetPublicTutorProfile'
import useGetTutorRating from '@/features/feedback/hooks/useGetTutorRating'
import TutorRatingBadge from '@/features/feedback/components/ui/TutorRatingBadge'

const TutorPublicProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: profile, isLoading, isError } = useGetPublicTutorProfile(id)
  const { data: rating } = useGetTutorRating(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-8 text-center">
        <p className="text-lg font-semibold text-[#1E293B]">
          This tutor profile couldn't be found.
        </p>
        <Link
          to="/accueil"
          className="inline-block text-sm font-semibold text-[#2563EB] underline underline-offset-2"
        >
          Back to Accueil
        </Link>
      </div>
    )
  }

  const initials = `${profile.firstname} ${profile.lastname}`
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const { tutorProfile } = profile

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-start gap-4 rounded-3xl border border-[#E0E2E6] bg-white p-8">
        <Avatar className="h-20 w-20 shrink-0 after:border-none">
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
            <VerifiedBadge status={tutorProfile.verificationStatus} />
          </div>
          {profile.headline && (
            <p className="text-base font-semibold text-[#143681]">{profile.headline}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {profile.country && (
              <span className="flex items-center gap-1 text-sm text-[#143681]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </span>
            )}
            <TutorRatingBadge summary={rating} />
          </div>
        </div>
      </div>

      {profile.bio && (
        <div className="rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <p className="whitespace-pre-wrap break-words text-base text-[#143681]">{profile.bio}</p>
        </div>
      )}

      {profile.languages.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Languages</h3>
          <ul className="space-y-0.5">
            {profile.languages.map((lang) => (
              <li key={lang.language} className="text-sm text-[#143681]">
                <span className="font-semibold">{lang.language}</span>:{' '}
                {languageLevelLabels[lang.level] ?? lang.level}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tutorProfile.specialties.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {tutorProfile.specialties.map(({ specialty }) => (
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

      {tutorProfile.skills.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {tutorProfile.skills.map(({ skill }) => (
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

      {tutorProfile.portfolio.length > 0 && (
        <div className="space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Portfolio</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {tutorProfile.portfolio.map((item) => {
              const thumbnail = item.media?.find((media) => media.type === 'IMAGE')
              const thumbnailUrl = thumbnail && getAssetUrl(thumbnail.key ?? thumbnail.url)
              return (
                <div key={item.id} className="space-y-2">
                  <div className="aspect-square overflow-hidden rounded-2xl border border-[#D1D5DA] bg-[#F5F6F7]">
                    {thumbnailUrl && (
                      <img
                        src={thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="truncate px-1 text-sm font-semibold text-[#143681]">{item.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tutorProfile.certifications.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Certifications</h3>
          <ul className="space-y-2">
            {tutorProfile.certifications.map((cert) => (
              <li key={cert.id} className="text-sm text-[#143681]">
                <span className="font-semibold">{cert.title}</span> — {cert.issuer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tutorProfile.employment.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-[#E0E2E6] bg-white p-8">
          <h3 className="text-xl font-semibold text-[#143681]">Work history</h3>
          <ul className="space-y-3">
            {tutorProfile.employment.map((job) => (
              <li key={job.id} className="text-sm text-[#143681]">
                <p className="font-semibold">
                  {job.jobTitle} — {job.company}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(job.startDate).getFullYear()} –{' '}
                  {job.current ? 'Present' : job.endDate ? new Date(job.endDate).getFullYear() : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TutorPublicProfilePage
