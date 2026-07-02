import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const EditIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    className={cn('size-6', className)}
    fill="none"
    {...props}
  >
    <path
      stroke="#2563EB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21.174 6.812a2.819 2.819 0 1 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83L2.02 21.356a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497L21.174 6.81Z"
    />
  </svg>
)
export default EditIcon
