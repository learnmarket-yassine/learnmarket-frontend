import SuccessSendImage from '@/assets/SuccessSendImage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader/Loader'

type successModalProps = {
  disabled?: boolean
  handleClick?: MouseEventHandler<HTMLButtonElement>
  buttonTonTitle?: string
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  hideButton?: boolean
  title?: string
  description?: string
  isLoading?: boolean
  titleButton?: string
  type?: 'success' | 'error'
  name?: string
  onButtonClick?: () => void
}

const SuccessModal = (props: successModalProps) => {
  const navigate = useNavigate()

  const handleFooterClick = () => {
    if (props.onButtonClick) {
      props.onButtonClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <Dialog open={props?.isOpen} onOpenChange={props.setIsOpen}>
      {!props.hideButton ? (
        <DialogTrigger asChild>
          <Button disabled={props.disabled || props.isLoading} onClick={props?.handleClick}>
            {props.isLoading ? <Loader width="25" height="25" /> : props.buttonTonTitle}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        className="flex max-w-[300px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center pb-4">
            <SuccessSendImage />
          </DialogTitle>
          <DialogDescription className="flex flex-wrap justify-center text-[#2C2C2C]">
            <span className="text-center text-3xl font-[600]"> {props.title ?? 'title'}</span>
            <div className="grid gap-4 py-4 text-center">{props.description ?? 'description'}</div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 sm:justify-center">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full bg-[#1A46A7] px-6 py-3 font-semibold text-white hover:bg-[#1A46A7]"
            onClick={handleFooterClick}
          >
            {props.titleButton ?? 'cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal
