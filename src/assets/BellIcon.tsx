import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const BellIcon = ({ className, ...props }: IconProps) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    className={cn('size-6', className)}
    fill="none"
    {...props}
  >
    <path
      stroke="#102A63"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.3 21a1.941 1.941 0 0 0 3.4 0M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z"
    />
  </svg>
)
export default BellIcon
