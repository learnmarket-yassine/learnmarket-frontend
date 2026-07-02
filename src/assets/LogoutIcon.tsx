import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const LogoutIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      stroke="#102A63"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 19H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h4m7 4 5 5-5 5m5-5H7"
    />
  </svg>
)
export default LogoutIcon
