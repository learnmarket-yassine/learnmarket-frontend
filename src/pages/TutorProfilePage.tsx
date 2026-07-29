import { AuthUser } from '@/features/auth/store/types'
import CertificationsSection from '@/features/myProfile/components/layout/CertificationsSection'
import EmploymentSection from '@/features/myProfile/components/layout/EmploymentSection'
import MyProfileHeader from '@/features/myProfile/components/layout/MyProfileHeader'
import MyProfileLeftSidebar from '@/features/myProfile/components/layout/MyProfileLeftSidebar'
import MyProfileMainContent from '@/features/myProfile/components/layout/MyProfileMainContent'
import { useStore } from '@/store/store'

const TutorProfilePage = () => {
  const user = useStore((state) => state.auth.user)
  const myProfile = user ?? ({} as AuthUser)
  return (
    <>
      <div className="rounded-lg border border-[#D1D5DA]">
        {/* 1. Full-width profile header */}
        <MyProfileHeader profile={myProfile} />

        {/* 2. Two-column section: sidebar left, main content right */}
        <div className="grid grid-cols-1 border-t border-[#D1D5DA] lg:grid-cols-[1fr_2fr]">
          <MyProfileLeftSidebar myProfile={myProfile} />
          <MyProfileMainContent myProfile={myProfile} />
        </div>
      </div>
      <CertificationsSection certifications={myProfile?.tutorProfile?.certifications ?? []} />
      <EmploymentSection employment={myProfile?.tutorProfile?.employment ?? []} />
    </>
  )
}

export default TutorProfilePage
