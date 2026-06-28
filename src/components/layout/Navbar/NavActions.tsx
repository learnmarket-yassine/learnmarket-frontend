import { IconButton } from '@/components/ui/IconButton'
import { UserProfile } from '@/types/nav'
import { cn } from '@/lib/utils'
import { UserMenuDropdown } from './UserMenuDropdown'
import HelpIcon from '@/assets/HelpIcon'
import BellIcon from '@/assets/BellIcon'

interface NavActionsProps {
  user: UserProfile
  notificationCount?: number
  onHelpClick?: () => void
  onNotificationsClick?: () => void
  onNavigate?: (path: string) => void
  onLogout?: () => void
  className?: string
}

function NavActions({
  user,
  notificationCount = 0,
  onHelpClick,
  onNotificationsClick,
  onNavigate,
  onLogout,
  className,
}: NavActionsProps) {
  return (
    <div className={cn('flex items-center gap-7', className)}>
      {/* Help */}
      <IconButton icon={<HelpIcon />} label="Help" onClick={onHelpClick} />

      {/* Notifications */}
      <IconButton
        icon={<BellIcon />}
        label="Notifications"
        badge={notificationCount}
        onClick={onNotificationsClick}
      />

      {/* User avatar + dropdown */}
      <UserMenuDropdown user={user} onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  )
}
export default NavActions
