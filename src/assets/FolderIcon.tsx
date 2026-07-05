import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const FolderIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={30}
    fill="none"
    viewBox="0 0 35 30"
    className={cn('size-6', className)}
  >
    <path
      fill="#fff"
      d="M30 30a5 5 0 0 0 5-5v-7.5a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5V25a5 5 0 0 0 5 5h25ZM0 11.91V5a5 5 0 0 1 5-5h8.965a3.75 3.75 0 0 1 2.65 1.098l3.537 3.535c.233.235.551.367.883.367H30a5 5 0 0 1 5 5v1.91A7.472 7.472 0 0 0 30 10H5a7.472 7.472 0 0 0-5 1.91Z"
    />
  </svg>
)
export default FolderIcon
