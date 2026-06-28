import YoraLogo from '@/assets/YoraLogo'
import { cn } from '@/lib/utils'

type NavBrandProps = {
  className?: string
}

function NavBrand({ className }: NavBrandProps) {
  return (
    <a
      href="/"
      aria-label="Go to homepage"
      className={cn(
        'flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <YoraLogo />
    </a>
  )
}
export default NavBrand
