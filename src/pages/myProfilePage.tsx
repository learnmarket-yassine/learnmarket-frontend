import CertificationsSection from '@/features/myProfile/components/layout/CertificationsSection'
import EmploymentSection from '@/features/myProfile/components/layout/EmploymentSection'
import MyProfileHeader from '@/features/myProfile/components/layout/MyProfileHeader'
import MyProfileLayout from '@/features/myProfile/components/layout/MyProfileLayout'
import MyProfileLeftSidebar from '@/features/myProfile/components/layout/MyProfileLeftSidebar'
import MyProfileMainContent from '@/features/myProfile/components/layout/MyProfileMainContent'
import { MOCK_PROFILE } from '@/features/myProfile/mock'

const MyProfilePage = () => {
  return (
    <MyProfileLayout>
      <div className="rounded-lg border border-[#D1D5DA]">
        {/* 1. Full-width profile header */}
        <MyProfileHeader profile={MOCK_PROFILE} />

        {/* 2. Two-column section: sidebar left, main content right */}
        <div className="grid grid-cols-1 gap-5 border-t border-[#D1D5DA] lg:grid-cols-[1fr_2fr]">
          <MyProfileLeftSidebar myProfile={MOCK_PROFILE} />
          <MyProfileMainContent myProfile={MOCK_PROFILE} />
        </div>
      </div>

      {/* <TestimonialsSection testimonials={MOCK_PROFILE.testimonials} /> */}
      <CertificationsSection certifications={MOCK_PROFILE.certifications} />
      <EmploymentSection employment={MOCK_PROFILE.employment} />
    </MyProfileLayout>
  )
}

export default MyProfilePage
