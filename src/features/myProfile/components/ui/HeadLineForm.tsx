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

type HeadlineFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function HeadlineForm(props: HeadlineFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)

  const form = useForm<HeadLineFormData>({
    resolver: zodResolver(headlineSchema),
  })

  const { register, handleSubmit, formState, reset } = form
  const { errors } = formState

  useEffect(() => {
    if (props.edit) {
      reset({
        headline: tutorProfile?.headline ?? '',
      })
    } else reset()
  }, [props.edit, isOpen, reset, tutorProfile])

  const onSubmit: SubmitHandler<HeadLineFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data.headline)
    } else {
      //Todo: call the create mutation
      console.warn('create', data.headline)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit headline" />
          ) : (
            <Button type="button" onClick={() => setIsOpen(true)}>
              create
            </Button>
          )}
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
                <span className="text-4xl font-bold text-[#143681]">
                  {!props.edit ? 'Create your title' : 'Edit your title'}
                </span>
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
                Your title {!props.edit && <span>*</span>}
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
