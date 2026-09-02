import { useNavigate } from 'react-router-dom'
import { UserProfile } from '@/types/nav'
import NavActions from './NavActions'
import NavBrand from './NavBrand'
import { NavMenu } from './NavMenu'
import useLogout from '@/features/auth/hooks/useLogout'
import SearchBar from '@/components/ui/SearchBar'

interface NavbarProps {
  user: UserProfile
}

function Navbar({ user }: NavbarProps) {
  const logout = useLogout()
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-50 h-28 w-full bg-white">
      <div className="container flex items-center justify-between py-8">
        <NavBrand />
        <NavMenu />
        {/* Search */}
        <SearchBar onSearch={(q) => console.log('Search:', q)} className="hidden sm:flex" />
        <NavActions
          user={user}
          onNavigate={(path) => navigate(path)}
          onLogout={() => logout.mutate()}
        />
      </div>
    </header>
  )
}
export default Navbar
