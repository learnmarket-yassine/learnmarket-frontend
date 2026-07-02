export interface NavItemConfig {
  label: string
  href?: string
  children?: NavItemConfig[]
}

export interface MenuItemConfig {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

export interface UserProfile {
  name: string
  role: string
  avatarUrl?: string
  isOnline: boolean
}
