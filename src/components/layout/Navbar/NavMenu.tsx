import { cn } from '@/lib/utils'
import { NavItemConfig } from '@/types/nav'
import { NavItem } from './NavItem'
import { NAV_ITEMS } from '@/lib/Constants'

interface NavMenuProps {
  items?: NavItemConfig[]
  className?: string
}

export function NavMenu({ items = NAV_ITEMS, className }: NavMenuProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn('hidden items-center gap-1 md:flex', className)}
    >
      {items.map((item) => (
        <NavItem key={item.label} item={item} className="px-3 py-2" />
      ))}
    </nav>
  )
}
