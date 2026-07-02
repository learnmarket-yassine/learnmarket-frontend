import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const HelpIcon = ({ className, ...props }: IconProps) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      stroke="#102A63"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.09 8a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M21 11c0 5.523-4.477 10-10 10S1 16.523 1 11 5.477 1 11 1s10 4.477 10 10Z"
    />
  </svg>
)
export default HelpIcon
