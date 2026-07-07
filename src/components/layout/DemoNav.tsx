import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/annonces', label: 'Annonces' },
  { to: '/proposals', label: 'My Proposals' },
  { to: '/connects', label: 'Connects' },
  { to: '/profile', label: 'Profile' },
]

/** Temporary nav for the Connects/Annonces/Proposals demo — remove once these are wired into the real navbar. */
const DemoNav = () => (
  <nav className="flex gap-4 border-b pb-3 text-sm">
    {links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          cn('font-medium text-gray-500 hover:text-gray-900', isActive && 'text-black underline')
        }
      >
        {link.label}
      </NavLink>
    ))}
  </nav>
)

export default DemoNav
