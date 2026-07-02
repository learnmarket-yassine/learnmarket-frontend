import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>
const ImageIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    className={cn('size-6', className)}
    {...props}
  >
    <path
      fill="#1D1B20"
      d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"
    />
  </svg>
)
export default ImageIcon
