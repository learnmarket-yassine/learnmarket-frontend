import SaveImage from '@/assets/SaveImage'
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
import { Loader } from 'lucide-react'
import { useState } from 'react'
import useConfirmSession from '../../hooks/useConfirmSession'

type ConfirmSessionModalProps = {
  sessionId: string
}

const ConfirmSessionModal = ({ sessionId }: ConfirmSessionModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { handleConfirmSession, isPending: isConfirming } = useConfirmSession(sessionId)

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen} key="confirm-session">
        <DialogTrigger asChild type="button">
          <Button
            type="button"
            className="h-full bg-[#143681] px-6 py-3 text-white hover:bg-[#143681]"
            disabled={isConfirming}
          >
            Confirm Session went well
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-[300px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <SaveImage />
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center text-[#2C2C2C]">
              <span className="mb-4 text-center text-3xl font-[600]">
                Confirm this session went well?
              </span>
              <div className="text-center">
                Clicking Confirm will release payment to the tutor. If you encountered a problem
                with this session, please click Report instead.
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full justify-center gap-2">
            <DialogTrigger asChild>
              <Button
                type="button"
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              >
                cancel
              </Button>
            </DialogTrigger>
            <Button
              type="button"
              disabled={isConfirming}
              className={`bg-[#143681] ${isConfirming ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-white hover:bg-[#143681]`}
              onClick={() => {
                handleConfirmSession()
                setIsOpen(false)
              }}
            >
              {isConfirming ? <Loader width="25" height="25" /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConfirmSessionModal
