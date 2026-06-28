import MenuItem from './MenuItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { UserProfile } from '@/types/nav'
import { useState } from 'react'
import AvatarImg from '@/assets/images/avatar.png'
import UserIcon from '@/assets/UserIcon'
import LayoutIcon from '@/assets/LayoutIcon'
import MessagesIcon from '@/assets/MessagesIcon'
import SettingsIcon from '@/assets/SettingsIcon'
import LogoutIcon from '@/assets/LogoutIcon'
interface UserMenuDropdownProps {
  user: UserProfile
  onNavigate?: (path: string) => void
  onLogout?: () => void
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void
}

export function UserMenuDropdown({ user, onNavigate, onLogout }: UserMenuDropdownProps) {
  const [isOnline, setIsOnline] = useState(user.isOnline)

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Popover>
      {/* ── Trigger: avatar button ──────────────────────────────────────── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="rounded-full focus-visible:outline-none"
        >
          <Avatar className="h-10 w-10 cursor-pointer after:border-none">
            <AvatarImage src={AvatarImg} alt={user.name} />
            <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      {/* ── Panel ───────────────────────────────────────────────────────── */}
      <PopoverContent align="end" sideOffset={7} className="w-64 border bg-white py-5 pl-3">
        {/* User info header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 after:border-none">
            <AvatarImage src={AvatarImg} alt={user.name} />
            <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#102A63]">{user.name}</p>
            <p className="truncate text-xs text-[#102A63]">{user.role}</p>
          </div>
        </div>

        {/* Online toggle */}
        <div className="flex items-center justify-between rounded-md px-3 py-4">
          <span className="text-base font-medium text-[#102A63]">Online for messages</span>
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
            aria-label="Toggle online status"
            className="data-[state=checked]:bg-[#2563EB]"
          />
        </div>
        {/* Navigation items */}
        <div className="space-y-0.5">
          <MenuItem
            icon={<UserIcon />}
            label="Your Profile"
            onClick={() => onNavigate?.('/profile')}
          />
          <MenuItem
            icon={<LayoutIcon />}
            label="Dashboard"
            onClick={() => onNavigate?.('/dashboard')}
          />
          <MenuItem
            icon={<MessagesIcon />}
            label="Messages"
            onClick={() => onNavigate?.('/messages')}
          />
          <MenuItem
            icon={<SettingsIcon />}
            label="Account settings"
            onClick={() => onNavigate?.('/settings')}
          />
          {/* Log out */}
          <MenuItem icon={<LogoutIcon />} label="Log out" onClick={() => onLogout} />
        </div>
        {/* Account settings */}
      </PopoverContent>
    </Popover>
  )
}
