import Footer from '@/components/layout/Footer/Footer'
import Navbar from '@/components/layout/Navbar/Navbar'

type MyProfileLayoutProps = {
  children: React.ReactNode
}

const MyProfileLayout = ({ children }: MyProfileLayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* ── Sticky navigation ──────────────────────────────────────────── */}
      <Navbar
        user={{ name: 'Amine Ben Khaled', role: 'Teacher', isOnline: true }}
        notificationCount={2}
      />

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="container px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5">{children}</div>
      </main>
      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default MyProfileLayout
