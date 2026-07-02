import { cn } from '@/lib/utils'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

function MenuItem({ icon: Icon, label, onClick, variant = 'default' }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-4 text-base text-[#102A63] transition-colors',
        variant === 'danger' && 'text-destructive hover:bg-destructive/10'
      )}
    >
      {Icon}
      {label}
    </button>
  )
}
export default MenuItem
