import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const LayoutIcon = ({ className, ...props }: IconProps) => (
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
      d="M7 1H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1ZM18 1h-5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1ZM18 10h-5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1ZM7 14H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Z"
    />
  </svg>
)
export default LayoutIcon
