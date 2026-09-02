import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

interface NavItemProps {
  to: string
  label: string
  isActive?: boolean
}

export function NavItem({ to, label, isActive }: NavItemProps) {
  const baseStyles =
    'px-3 py-2 flex items-center gap-1 text-lg font-semibold text-[#143681] transition-colors hover:text-[#143681]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <NavLink to={to} className={cn(baseStyles, isActive && 'underline')}>
      {label}
    </NavLink>
  )
}
