import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const UserIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={20}
    fill="none"
    viewBox="0 0 16 20"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      stroke="#102A63"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
  </svg>
)
export default UserIcon
