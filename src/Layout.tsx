import Footer from './components/layout/Footer/Footer'
import Navbar from './components/layout/Navbar/Navbar'
import { useStore } from './store/store'
import { Outlet } from 'react-router-dom'
import { getAssetUrl } from './lib/utils'

const Layout = () => {
  const user = useStore((state) => state.auth.user)
  return (
    <div className="min-h-screen">
      {/* ── Sticky navigation ──────────────────────────────────────────── */}
      {user && (
        <Navbar
          user={{
            name: `${user.firstname} ${user.lastname}`,
            role: user?.role,
            isOnline: user?.isOnlineForMsg,
            avatarUrl: getAssetUrl(user?.avatar),
          }}
        />
      )}

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="container px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5">
          <Outlet />
        </div>
      </main>
      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default Layout
