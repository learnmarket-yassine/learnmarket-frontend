import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const MessagesIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    viewBox="0 0 21 21"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      stroke="#102A63"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6.9 18.008a9 9 0 1 0-3.9-3.9l-2 5.9 5.9-2Z"
    />
  </svg>
)
export default MessagesIcon
