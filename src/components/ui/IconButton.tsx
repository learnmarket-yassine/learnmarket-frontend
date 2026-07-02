import { forwardRef } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  badge?: number
  className?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, badge, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label={label}
        className={cn('relative h-9 w-9 rounded-full', className)}
        {...props}
      >
        {Icon}

        {/* Notification badge */}
        {badge !== undefined && badge > 0 && (
          <span
            aria-label={`${badge} notifications`}
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'
