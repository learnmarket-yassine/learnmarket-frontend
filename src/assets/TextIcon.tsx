import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>
const TextIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={16}
    fill="none"
    viewBox="0 0 20 16"
    className={cn('size-6', className)}
    {...props}
  >
    <path fill="#1D1B20" d="M5 16V3H0V0h13v3H8v13H5Zm9 0V8h-3V5h9v3h-3v8h-3Z" />
  </svg>
)
export default TextIcon
