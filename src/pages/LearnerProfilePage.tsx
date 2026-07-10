import { AuthUser } from '@/features/auth/store/types'
import LearnerProfileLeftSidebar from '@/features/myProfile/components/layout/LearnerProfileLeftSidebar'
import LearnerProfileMainContent from '@/features/myProfile/components/layout/LearnerProfileMainContent'
import MyProfileHeader from '@/features/myProfile/components/layout/MyProfileHeader'
import { useStore } from '@/store/store'

const LearnerProfilePage = () => {
  const user = useStore((state) => state.auth.user)
  const myProfile = user ?? ({} as AuthUser)
  return (
    <div className="rounded-lg border border-[#D1D5DA]">
      {/* 1. Full-width profile header */}
      <MyProfileHeader profile={myProfile} />

      {/* 2. Two-column section: sidebar left, main content right */}
      <div className="grid grid-cols-1 border-t border-[#D1D5DA] lg:grid-cols-[1fr_2fr]">
        <LearnerProfileLeftSidebar myProfile={myProfile} />
        <LearnerProfileMainContent myProfile={myProfile} />
      </div>
    </div>
  )
}

export default LearnerProfilePage
