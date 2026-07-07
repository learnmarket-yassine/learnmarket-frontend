import Navbar from '@/components/layout/Navbar/Navbar'
import { useStore } from '@/store/store'
import { getAssetUrl } from '@/lib/utils'

type TutorOnboardingLayoutProps = {
  children: React.ReactNode
}

const TutorOnboardingLayout = ({ children }: TutorOnboardingLayoutProps) => {
  const user = useStore((state) => state.auth.user)
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Sticky navigation ──────────────────────────────────────────── */}
      {user && (
        <Navbar
          user={{
            name: `${user.firstname} ${user.lastname}`,
            role: user?.role,
            isOnline: user?.isOnlineForMsg,
            avatarUrl: getAssetUrl(user?.avatar),
          }}
          notificationCount={2}
        />
      )}

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="container flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export default TutorOnboardingLayout
