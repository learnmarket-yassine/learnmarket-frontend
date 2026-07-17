import Navbar from '@/components/layout/Navbar/Navbar'
import { useStore } from '@/store/store'
import { getAssetUrl } from '@/lib/utils'

type CreateLearnRequestLayoutProps = {
  children: React.ReactNode
}

const CreateLearnRequestLayout = ({ children }: CreateLearnRequestLayoutProps) => {
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
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

export default CreateLearnRequestLayout
