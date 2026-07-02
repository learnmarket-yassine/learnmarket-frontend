import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>
const VideoIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={16}
    fill="none"
    viewBox="0 0 20 16"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      fill="#1D1B20"
      d="M2 16a1.99 1.99 0 0 1-1.425-.575A1.99 1.99 0 0 1 0 14V2C0 1.45.192.983.575.6.975.2 1.45 0 2 0h12c.55 0 1.017.2 1.4.6.4.383.6.85.6 1.4v4.5l4-4v11l-4-4V14c0 .55-.2 1.025-.6 1.425-.383.383-.85.575-1.4.575H2Zm0-2h12V2H2v12Zm0 0V2v12Z"
    />
  </svg>
)
export default VideoIcon
