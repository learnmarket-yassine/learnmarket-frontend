import { UserProfile } from '@/types/nav'
import NavActions from './NavActions'
import NavBrand from './NavBrand'
import { NavMenu } from './NavMenu'
import SearchBar from '@/components/ui/SearchBar'

interface NavbarProps {
  user: UserProfile
  notificationCount?: number
}

function Navbar({ user, notificationCount = 0 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 h-28 w-full">
      <div className="container flex items-center justify-between py-8">
        <NavBrand />
        <NavMenu />
        {/* Search */}
        <SearchBar onSearch={(q) => console.log('Search:', q)} className="hidden sm:flex" />
        <NavActions
          user={user}
          notificationCount={notificationCount}
          onNavigate={(path) => console.log('Navigate to:', path)}
          onLogout={() => console.log('Logout')}
        />
      </div>
    </header>
  )
}
export default Navbar
