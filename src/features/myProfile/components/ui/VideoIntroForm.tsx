import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/store'
import { VideoIntroFormData, videoIntroSchema } from '../../schemas'
import EditButton from './EditButton'
import { CustomInput } from '@/components/ui/CustomInput'
import AddButton from './AddButton'

type VideoIntroFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function VideoIntroForm(props: VideoIntroFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)

  const form = useForm<VideoIntroFormData>({
    resolver: zodResolver(videoIntroSchema),
  })

  const { handleSubmit, reset, formState, register } = form
  const { errors } = formState

  useEffect(() => {
    if (props.edit) {
      reset({
        videoIntroUrl: tutorProfile?.videoIntroUrl ?? '',
      })
    } else reset()
  }, [props.edit, isOpen, reset, tutorProfile])

  const onSubmit: SubmitHandler<VideoIntroFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data.videoIntroUrl)
    } else {
      //Todo: call the create mutation
      console.warn('create', data.videoIntroUrl)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit video introduction" />
          ) : (
            <AddButton label="create video introduction" />
          )}
        </DialogTrigger>
        <DialogContent
          className="flex h-[320px] w-[400px] flex-col space-y-4 sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">
                  {props.edit ? 'Edit video introduction' : 'Add video introduction'}
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
          </DialogHeader>
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 space-y-4 overflow-y-auto">
              <Label htmlFor="headline" className="text-base font-bold text-[#5E5E5E]">
                Link to your YouTube video {!props.edit && <span>*</span>}
              </Label>
              <CustomInput
                type="text"
                id="headline"
                placeholder="Ex: https://youtu.be/dQw4w9WgXcQ?si=RAPuMbMiMSDsk1yp"
                className="rounded-full border bg-white"
                width="w-full"
                error={errors.videoIntroUrl?.message}
                {...register('videoIntroUrl')}
              />
              <p className="text-base text-[#5E5E5E]">Does your video meet Yora's guidelines?</p>
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

export default VideoIntroForm
