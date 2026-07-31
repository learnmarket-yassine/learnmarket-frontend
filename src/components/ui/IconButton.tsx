import { forwardRef } from 'react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { cn } from '@/lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  badge?: number
  className?: string
  disabledReason?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, badge, className, disabled, disabledReason, ...props }, ref) => {
    const button = (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label={label}
        disabled={disabled}
        className={cn('relative h-9 w-9 rounded-full', className)}
        {...props}
      >
        {Icon}

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

    if (!disabled || !disabledReason) return button

    return (
      // Self-contained provider so this works regardless of whether an
      // ancestor already mounts one (nested providers are harmless in Radix).
      <TooltipProvider>
        <Tooltip>
          {/* Native `disabled` buttons don't reliably fire hover/focus events
              for the tooltip trigger, so wrap in a focusable span. */}
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex cursor-not-allowed">
              {button}
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)

IconButton.displayName = 'IconButton'
