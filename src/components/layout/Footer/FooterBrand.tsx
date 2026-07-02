import YoraLogo from '@/assets/YoraLogo'
import { cn } from '@/lib/utils'

type FooterBrandProps = {
  className?: string
}

const FooterBrand = ({ className }: FooterBrandProps) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <a
        href="/"
        aria-label="Go to homepage"
        className="flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <YoraLogo />
      </a>
      <div>
        <h2 className="text-[44px] font-semibold text-[#2563EB]">Yora</h2>
        <h5 className="text-xs text-[#2563EB]">Your Online Route to Achievement</h5>
      </div>
    </div>
  )
}

export default FooterBrand
