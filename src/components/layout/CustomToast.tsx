import SuccessIcon from '@/assets/SuccessIcon'
import FailedIcon from '@/assets/FailedIcon'
export type ToastProps = {
  message: string
  type: 'success' | 'error'
}

const CustomToast = (props: ToastProps) => {
  const IconComponent = props.type === 'success' ? SuccessIcon : FailedIcon

  return (
    <div className="flex flex-row-reverse items-center justify-end gap-4 text-xs font-light">
      {props.message}
      <div className="h-6 w-6">
        <IconComponent />
      </div>
    </div>
  )
}

export default CustomToast
