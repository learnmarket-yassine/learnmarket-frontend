import ArrowLeft from '@/assets/ArrowLeft'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

type RouteObject = {
  pathname: string
  state?: Record<string, unknown>
}

type Props = {
  disabled?: boolean
  text?: string
  className?: string
  route?: string | number | RouteObject
}

const BackButton = ({ disabled, text = 'Back', className, route = -1 }: Props) => {
  const navigate = useNavigate()

  const handleNavigation = () => {
    if (route === -1) {
      navigate(-1) // Navigate to the previous page
    } else if (typeof route === 'string') {
      navigate(route) // Navigate to the specified route
    } else if (typeof route === 'object' && route.pathname) {
      navigate(route.pathname, { state: route.state })
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'text-label flex items-center gap-3 font-semibold disabled:text-[#999999]',
        className
      )}
      onClick={handleNavigation}
    >
      <ArrowLeft />
      {text}
    </button>
  )
}

export default BackButton
