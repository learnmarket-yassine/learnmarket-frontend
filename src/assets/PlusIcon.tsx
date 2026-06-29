import { cn } from '@/lib/utils'
import * as React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

const PlusIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    className={cn('size-6', className)}
    {...props}
    fill="none"
  >
    <path
      stroke="#2563EB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M.75 7.75h14m-7-7v14"
    />
  </svg>
)
export default PlusIcon
