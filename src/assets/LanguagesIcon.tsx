import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

const LanguagesIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={17}
    fill="none"
    viewBox="0 0 19 17"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      fill="#434655"
      d="m9.083 16.667 3.792-10h1.75l3.792 10h-1.75l-.896-2.542h-4.042l-.896 2.542h-1.75Zm-6.583-2.5L1.333 13l4.209-4.208a9.636 9.636 0 0 1-1.323-1.667A14.445 14.445 0 0 1 3.125 5h1.75c.278.542.556 1.014.833 1.417.278.402.611.805 1 1.208.459-.458.934-1.1 1.427-1.927.493-.826.865-1.615 1.115-2.365H0V1.667h5.833V0H7.5v1.667h5.833v1.666h-2.416c-.292 1-.73 2.028-1.313 3.084-.583 1.055-1.16 1.86-1.729 2.416l2 2.042-.625 1.708L6.708 9.98 2.5 14.167Zm9.75-1.5h3l-1.5-4.25-1.5 4.25Z"
    />
  </svg>
)
export default LanguagesIcon
