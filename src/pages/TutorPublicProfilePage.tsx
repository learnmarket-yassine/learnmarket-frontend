import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import useGetPublicTutorProfile from '@/features/tutor-public-profile/hooks/useGetPublicTutorProfile'
import TutorFeedbackSection from '@/features/feedback/components/ui/TutorFeedbackSection'
import { PublicTutorProfile } from '@/features/tutor-public-profile/store/types'
import { AuthUser } from '@/features/auth/store/types'
import MyProfileHeader from '@/features/myProfile/components/layout/MyProfileHeader'
import MyProfileLeftSidebar from '@/features/myProfile/components/layout/MyProfileLeftSidebar'
import MyProfileMainContent from '@/features/myProfile/components/layout/MyProfileMainContent'
import CertificationsSection from '@/features/myProfile/components/layout/CertificationsSection'
import EmploymentSection from '@/features/myProfile/components/layout/EmploymentSection'

function toAuthUser(profile: PublicTutorProfile): AuthUser {
  return {
    id: profile.id,
    email: '',
    firstname: profile.firstname,
    lastname: profile.lastname,
    avatar: profile.avatar,
    bio: profile.bio ?? undefined,
    country: profile.country ?? undefined,
    headline: profile.headline ?? undefined,
    city: profile.city ?? undefined,
    role: 'TUTOR',
    isOnlineForMsg: false,
    isProfileCompleted: true,
    onboardingStep: 0,
    education: profile.education,
    languages: profile.languages,
    learnerProfile: null,
    tutorProfile: {
      id: profile.id,
      videoIntroUrl: profile.tutorProfile.videoIntroUrl,
      verificationStatus: profile.tutorProfile.verificationStatus,
      skills: profile.tutorProfile.skills.map(({ skill }) => skill),
      specialties: profile.tutorProfile.specialties.map(({ specialty }) => specialty),
      portfolio: profile.tutorProfile.portfolio,
      certifications: profile.tutorProfile.certifications,
      employment: profile.tutorProfile.employment,
      completedJobs: 0,
      inProgressJobs: 0,
      stripeChargesEnabled: false,
      stripePayoutsEnabled: false,
    },
  }
}

const TutorPublicProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: profile, isLoading, isError } = useGetPublicTutorProfile(id)

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

  const myProfile = toAuthUser(profile)

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="rounded-lg border border-[#D1D5DA]">
        <MyProfileHeader profile={myProfile} readOnly />
        <div className="grid grid-cols-1 border-t border-[#D1D5DA] lg:grid-cols-[1fr_2fr]">
          <MyProfileLeftSidebar myProfile={myProfile} readOnly />
          <MyProfileMainContent myProfile={myProfile} readOnly />
        </div>
      </div>
      <CertificationsSection
        certifications={myProfile.tutorProfile?.certifications ?? []}
        readOnly
      />
      <EmploymentSection employment={myProfile.tutorProfile?.employment ?? []} readOnly />
      <TutorFeedbackSection tutorId={profile.id} />
    </div>
  )
}

export default TutorPublicProfilePage
