import { IconButton } from '@/components/ui/IconButton'
import { UserProfile } from '@/types/nav'
import { cn } from '@/lib/utils'
import { UserMenuDropdown } from './UserMenuDropdown'
import HelpIcon from '@/assets/HelpIcon'
import { NotificationsBell } from '@/features/notifications/components/ui/NotificationsBell'

interface NavActionsProps {
  user: UserProfile
  onHelpClick?: () => void
  onNavigate?: (path: string) => void
  onLogout?: () => void
  className?: string
}

function NavActions({ user, onHelpClick, onNavigate, onLogout, className }: NavActionsProps) {
  return (
    <div className={cn('flex items-center gap-7', className)}>
      {/* Help */}
      <IconButton icon={<HelpIcon />} label="Help" onClick={onHelpClick} />

      {/* Notifications */}
      <NotificationsBell />

      {/* User avatar + dropdown */}
      <UserMenuDropdown user={user} onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  )
}
export default NavActions
