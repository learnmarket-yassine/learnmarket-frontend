import { useStore } from '@/store/store'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { useNavigate } from 'react-router-dom'
import StopImage from '@/assets/StopImage'

const VerificationRequiredModal = () => {
  const user = useStore((state) => state.auth.user)
  const isNotVerified =
    user?.tutorProfile?.verificationStatus && user?.tutorProfile?.verificationStatus !== 'APPROVED'
  const navigate = useNavigate()
  if (!isNotVerified || !user) return null
  return (
    <Dialog open>
      <DialogContent
        className="flex max-w-[300px] flex-wrap justify-center py-[2rem] sm:max-w-[335px] lg:max-h-[650px] lg:max-w-[450px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <StopImage />
          </DialogTitle>
          <DialogDescription className="flex flex-col flex-wrap justify-center text-[#2C2C2C]">
            <div className="mt-2 text-center text-3xl font-semibold">
              Complete verification to start proposing
            </div>
            <div className={`grid gap-4 py-4 text-center`}>
              You need an approved profile before you can submit proposals to learner
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full justify-center gap-2">
          <Button
            type="button"
            className="h-full whitespace-nowrap rounded-full bg-[#143681] px-6 py-3 font-semibold text-white hover:bg-[#143681] disabled:cursor-not-allowed disabled:opacity-50"
            variant="default"
            onClick={() => navigate('/profile')}
          >
            Go to your profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default VerificationRequiredModal
