import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionCardProps {
  children: ReactNode
  className?: string
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}
