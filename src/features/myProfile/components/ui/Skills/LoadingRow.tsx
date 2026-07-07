import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingRowProps {
  label: string
  size?: 'sm' | 'md'
}

function LoadingRow({ label, size = 'md' }: LoadingRowProps) {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-[#5E5E5E]',
        isSmall ? 'text-xs' : 'text-sm'
      )}
    >
      <Loader2 className={isSmall ? 'size-3 animate-spin' : 'size-4 animate-spin'} />
      {label}
    </div>
  )
}

export default LoadingRow
