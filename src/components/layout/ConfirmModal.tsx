import TrashImage from '@/assets/TrashImage'
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
import DeleteButton from '@/features/myProfile/components/ui/DeleteButton'
import { Loader } from 'lucide-react'
import { MouseEventHandler } from 'react'

type Props = {
  name: string
  type: 'delete' | 'confirm'
  title: string
  description: string
  handleConfirm?: MouseEventHandler<HTMLButtonElement>
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  disabledConfirmModal?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean | null>>
  buttonTitle?: string
  buttonClassName?: string
  iconColor?: string
  saveClassName?: string
  confirmButtonText?: string
  cancelButtonText?: string
  handleClickCancel?: MouseEventHandler<HTMLButtonElement>
}

const ConfirmModal = (props: Props) => {
  return (
    <div>
      <Dialog open={props?.isOpen} onOpenChange={props.setIsOpen} key={props.description}>
        {props.name !== 'Event Exception Modal' && (
          <DialogTrigger asChild type="button">
            <button
              type="button"
              className={`flex rounded-md ${props.buttonClassName ?? ''}`}
              disabled={props?.disabledConfirmModal}
              onClick={(e) => {
                e.stopPropagation()
                if (props?.onClick) {
                  props.onClick(e)
                }
              }}
            >
              {props.type === 'delete' ? (
                <DeleteButton label="delete" />
              ) : props.buttonTitle ? (
                <Button
                  type="button"
                  className={`relative px-8 py-4 text-lg ${props.saveClassName}`}
                >
                  {props.buttonTitle}
                </Button>
              ) : (
                <Button className={`relative ${props.saveClassName || ''}`}>save</Button>
              )}
            </button>
          </DialogTrigger>
        )}
        <DialogContent className="flex max-w-[300px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              {props.type === 'delete' ? <TrashImage /> : null}
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center text-[#2C2C2C]">
              <span className="mb-4 text-center text-3xl font-[600]">{props.title}</span>
              <div className="text-center">{props.description}</div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full justify-center gap-2">
            <Button
              type="button"
              className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
              onClick={(e) => {
                if (props?.handleClickCancel) {
                  props.handleClickCancel(e)
                } else {
                  e.stopPropagation()
                }
              }}
            >
              {props.cancelButtonText || 'cancel'}
            </Button>
            <Button
              type="button"
              disabled={
                (props.isLoading !== undefined && props.isLoading) ||
                (props?.disabled !== undefined && props?.disabled)
              }
              className={`${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-medium text-white hover:bg-[#2563EB]`}
              onClick={props.handleConfirm}
            >
              {props.isLoading !== undefined && props.isLoading ? (
                <Loader width="25" height="25" />
              ) : (
                props.confirmButtonText || 'confirmer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConfirmModal
