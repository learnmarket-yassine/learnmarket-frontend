import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const TrashIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    viewBox="0 0 20 22"
    className={cn('size-6', className)}
    {...props}
    fill="none"
  >
    <path
      stroke="#2563EB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M.75 4.75h18m-2 0v14c0 1-1 2-2 2h-10c-1 0-2-1-2-2v-14m3 0v-2c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"
    />
  </svg>
)
export default TrashIcon
