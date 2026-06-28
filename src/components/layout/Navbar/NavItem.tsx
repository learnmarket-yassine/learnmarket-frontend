import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NavItemConfig } from '@/types/nav'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface NavItemProps {
  item: NavItemConfig
  className?: string
}

export function NavItem({ item, className }: NavItemProps) {
  const baseStyles =
    'flex items-center gap-1 text-lg font-semibold text-[#143681] transition-colors hover:text-[#143681]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  if (!item.children || item.children.length === 0) {
    return (
      <a href={item.href ?? '#'} className={cn(baseStyles, className)}>
        {item.label}
      </a>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(baseStyles, 'data-[state=open]:text-[#143681]/90', className)}
      >
        {item.label}
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="min-w-44">
        {item.children.map((child) => (
          <DropdownMenuItem key={child.label} asChild>
            <a href={child.href ?? '#'} className="w-full cursor-pointer text-sm">
              {child.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
