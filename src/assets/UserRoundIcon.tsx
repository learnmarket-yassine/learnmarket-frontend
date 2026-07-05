import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const UserRoundIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 66 84"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      fill="#9CA3AF"
      fillRule="evenodd"
      d="M14.996 18c0-9.934 8.066-18 18-18 9.935 0 18 8.066 18 18s-8.065 18-18 18c-9.934 0-18-8.066-18-18ZM0 74.42c.281-18.023 14.971-32.486 32.996-32.486 18.026 0 32.716 14.463 32.997 32.486a3 3 0 0 1-1.748 2.78A74.733 74.733 0 0 1 32.996 84c-11.144 0-21.732-2.432-31.248-6.8A3 3 0 0 1 0 74.42Z"
      clipRule="evenodd"
    />
  </svg>
)
export default UserRoundIcon
