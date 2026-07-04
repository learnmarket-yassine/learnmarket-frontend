import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const UploadIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    viewBox="0 0 17 17"
    className={cn('size-5', className)}
    {...props}
  >
    <path
      stroke="#2563EB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M.832 12.084v1.875c0 1.035.84 1.875 1.875 1.875h11.25c1.036 0 1.875-.84 1.875-1.875v-1.875m-11.25-7.5 3.75-3.75m0 0 2.5 2.5m-2.5-2.5V11.25"
    />
  </svg>
)
export default UploadIcon
