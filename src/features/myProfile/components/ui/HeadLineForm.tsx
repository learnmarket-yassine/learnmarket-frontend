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
import { CustomInput } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { HeadLineFormData, headlineSchema } from '../../schemas'
import EditButton from './EditButton'
import useEditUserInfo from '../../hooks/useEditUser'

function HeadlineForm() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useStore((state) => state.auth.user)
  const { mutate: editUserMutation, isPending } = useEditUserInfo()
  const form = useForm<HeadLineFormData>({
    resolver: zodResolver(headlineSchema),
  })

  const { register, handleSubmit, formState, reset } = form
  const { errors } = formState

  useEffect(() => {
    reset({
      headline: user?.headline ?? '',
    })
  }, [isOpen, reset, user])

  const onSubmit: SubmitHandler<HeadLineFormData> = async (data) => {
    editUserMutation(data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit headline" />
        </DialogTrigger>
        <DialogContent
          className="flex h-[400px] min-w-[750px] flex-col space-y-9"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader className="space-y-5">
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Edit your title</span>
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
            <DialogDescription className="text-base text-[#5E5E5E]">
              Enter a single sentence description of your professional skills/experience (e.g.
              Expert Web Designer with Ajax experience)
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
              <Label htmlFor="headline" className="text-base font-bold text-[#5E5E5E]">
                Your title
              </Label>
              <CustomInput
                type="text"
                id="headline"
                placeholder="Digital Marketing | Video Editing, Video Editing & Production, Logo"
                className="rounded-full border bg-white"
                width="w-full"
                error={errors.headline?.message}
                {...register('headline')}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
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

export default HeadlineForm
