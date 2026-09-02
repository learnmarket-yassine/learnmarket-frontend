import { cn } from '@/lib/utils'
import { NavItemConfig } from '@/types/nav'
import { NavItem } from './NavItem'
import { useStore } from '@/store/store'

interface NavMenuProps {
  items?: NavItemConfig[]
  className?: string
}

export function NavMenu({ className }: NavMenuProps) {
  const user = useStore((state) => state.auth.user)
  const navData = [
    {
      to: '/accueil',
      label: 'accueil',
      enabled: true,
      isActive: location.pathname.includes('/accueil'),
    },
    {
      to: '/availability',
      label: 'availability',
      enabled: user?.role === 'TUTOR',
      isActive: location.pathname.includes('/availability'),
    },
    {
      to: '/sessions',
      label: 'Sessions',
      enabled: true,
      isActive: location.pathname.includes('/sessions'),
    },
    {
      to: '/messages',
      label: 'Messages',
      enabled: true,
      isActive: location.pathname.includes('/messages'),
    },
    {
      to: '/proposals',
      label: 'proposals',
      enabled: user?.role === 'TUTOR',
      isActive: location.pathname.includes('/proposals'),
    },
    {
      to: '/sparks/buy',
      label: 'Buy Sparks',
      enabled: user?.role === 'TUTOR',
      isActive: location.pathname.includes('/sparks/buy'),
    },
  ]

  const filteredNavs = navData.filter((nav) => nav.enabled)

  return (
    <nav
      aria-label="Main navigation"
      className={cn('hidden items-center gap-1 md:flex', className)}
    >
      {filteredNavs.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
    </nav>
  )
}
