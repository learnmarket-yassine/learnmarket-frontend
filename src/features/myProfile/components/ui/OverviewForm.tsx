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

type OverviewFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function OverviewForm(props: OverviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)
  const form = useForm<OverviewFormData>({
    resolver: zodResolver(overviewSchema),
  })

  const { register, handleSubmit, formState, reset, watch } = form
  const { errors } = formState
  const remaremaremainingCharacters = 5000 - (watch('bio')?.length ?? 0)

  useEffect(() => {
    if (props.edit) {
      reset({
        bio: tutorProfile?.bio ?? '',
      })
    } else reset()
  }, [props.edit, isOpen, reset, tutorProfile])

  const onSubmit: SubmitHandler<OverviewFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data.bio)
    } else {
      //Todo: call the create mutation
      console.warn('create', data.bio)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit overview" />
          ) : (
            <Button type="button" onClick={() => setIsOpen(true)}>
              create
            </Button>
          )}
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
                Profile overview {!props.edit && <span>*</span>}
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
