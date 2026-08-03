import ErrorIcon from '@/assets/ErrorIcon'
import SaveImage from '@/assets/SaveImage'
import StopImage from '@/assets/StopImage'
import TrashImage from '@/assets/TrashImage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { MouseEventHandler } from 'react'
import IgnoreImage from '@/assets/IgnoreImage'

type Props = {
  name: string
  type: 'success' | 'error' | 'trash' | 'stop' | 'inactive'
  title: string
  description: string
  titleButton?: string
  buttonCancel?: boolean
  handleCancel?: () => void
  handleReturn?: MouseEventHandler<HTMLButtonElement>
  handleClose?: MouseEventHandler<HTMLButtonElement>
  isLoading?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const ConfirmMessageModal = (props: Props) => {
  if (!props.isOpen) return null

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen} key={props.description}>
      <DialogContent className="flex max-w-[300px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {props.type === 'error' ? (
              <ErrorIcon />
            ) : props.type === 'trash' ? (
              <TrashImage />
            ) : props.type === 'stop' ? (
              <StopImage />
            ) : props.type === 'inactive' ? (
              <IgnoreImage />
            ) : (
              <SaveImage />
            )}

            <div className="absolute right-10 top-10">
              {' '}
              {props.type !== 'stop' && (
                <button type="button" onClick={props.handleClose ?? props.handleReturn}>
                  <X className="text-label size-4" />
                </button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="mt-2 text-center text-3xl font-semibold">{props.title}</div>
            <div
              className={`grid gap-4 py-4 text-center ${props.type === 'trash' && 'text-[2rem] font-semibold leading-10'}`}
            >
              {props.description}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="w-full justify-center gap-2">
          {props.buttonCancel && (
            <Button type="button" className="w-1/2" variant="outline" onClick={props.handleCancel}>
              cancel
            </Button>
          )}
          <Button
            type="button"
            className={
              props.type === 'trash' ? 'w-full' : props.type !== 'error' ? 'w-1/2' : 'w-3/5'
            }
            variant={props.type !== 'error' ? 'default' : 'outline'}
            onClick={props.handleReturn}
          >
            {props?.titleButton ?? 'return'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmMessageModal
