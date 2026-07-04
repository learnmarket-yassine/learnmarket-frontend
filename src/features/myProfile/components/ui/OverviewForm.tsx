import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { OverviewFormData, overviewSchema } from '../../schemas'
import EditButton from './EditButton'
import { Textarea } from '@/components/ui/textarea'
import useEditUserInfo from '../../hooks/useEditUser'

function OverviewForm() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: editUserMutation, isPending } = useEditUserInfo()
  const user = useStore((state) => state.auth.user)
  const form = useForm<OverviewFormData>({
    resolver: zodResolver(overviewSchema),
  })

  const { register, handleSubmit, formState, reset, watch } = form
  const { errors } = formState
  const remaremaremainingCharacters = 5000 - (watch('bio')?.length ?? 0)

  useEffect(() => {
    reset({
      bio: user?.bio ?? '',
    })
  }, [isOpen, reset, user])

  const onSubmit: SubmitHandler<OverviewFormData> = async (data) => {
    editUserMutation(data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit overview" />
        </DialogTrigger>
        <DialogContent
          className="flex h-[600px] min-w-[650px] flex-col space-y-7"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-5">
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Profile Overview</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                >
                  <X className="size-9" />
                </button>
              </div>
            </DialogTitle>
            <DialogDescription className="space-y-5 text-base text-[#5E5E5E]">
              <p>
                Use this space to show clients you have the skills and experience they're looking
                for.
              </p>
              <ul className="list-inside list-disc space-y-2 text-[#5E5E5E]">
                <li>Describe your strengths and skills</li>
                <li>Highlight projects, accomplishments and education</li>
                <li>Keep it short and make sure it's error-free</li>
              </ul>
              <p>Learn more about building your profile</p>
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.stopPropagation()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="bio" className="text-base font-bold text-[#5E5E5E]">
                Profile overview
              </Label>
              <Textarea
                id="bio"
                placeholder="Digital Marketing | Video Editing, Video Editing & Production, Logo"
                className="h-[200px] resize-none rounded-xl border bg-white p-4"
                error={errors.bio?.message}
                {...register('bio')}
                maxLength={5000}
              />
              <div className="flex justify-end">
                <p className="text-sm text-[#5E5E5E]">{remaremaremainingCharacters} left</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB]"
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OverviewForm
