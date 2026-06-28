import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  message: string
  ctaLabel?: string
  onCta?: () => void
}

function EmptyState({ icon: Icon, message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
      )}
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      {ctaLabel && onCta && (
        <Button
          variant="link"
          onClick={onCta}
          className="h-auto p-0 text-sm font-medium text-blue-600"
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
export default EmptyState
