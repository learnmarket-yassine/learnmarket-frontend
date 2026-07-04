// LinkedinIcon.tsx — fixed, complete path
import { cn } from '@/lib/utils'
import * as React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

const LinkedinIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={cn('size-5', className)}
    {...props}
  >
    <path
      fill="#2563EB"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.833 0H4.167A4.167 4.167 0 0 0 0 4.167v11.666C0 18.134 1.866 20 4.167 20h11.666A4.167 4.167 0 0 0 20 15.833V4.167C20 1.866 18.135 0 15.833 0ZM6.667 15.833h-2.5V6.667h2.5v9.166Zm-1.25-10.42a1.452 1.452 0 1 1 0-2.904 1.452 1.452 0 0 1 0 2.903Zm11.25 10.42h-2.5v-4.998c0-1.192-.024-2.726-1.66-2.726-1.663 0-1.918 1.3-1.918 2.64v5.084h-2.5V6.667h2.4v1.098h.033c.334-.633 1.15-1.301 2.368-1.301 2.532 0 3 1.667 3 3.834v5.535Z"
    />
  </svg>
)

export default LinkedinIcon
