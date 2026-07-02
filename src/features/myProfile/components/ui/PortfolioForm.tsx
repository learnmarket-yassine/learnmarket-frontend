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
import { useStore } from '@/store/store'
import { EducationFormData, educationSchema } from '../../schemas'
import EditButton from './EditButton'
import AddButton from './AddButton'
import MediaBlock from '@/components/ui/MediaBlock'

type PortfolioFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function PortfolioForm(props: PortfolioFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tutorProfile = useStore((state) => state.myProfile.tutorProfile)

  const selectedEducation = tutorProfile?.education.find((education) => education.id === props.id)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (props.edit) {
      reset({
        institution: selectedEducation?.institution ?? '',
      })
    } else reset()
  }, [props.edit, isOpen, reset, selectedEducation])

  const onSubmit: SubmitHandler<EducationFormData> = async (data) => {
    if (props.edit) {
      //TODO: call the edit mutation
      console.warn('edit', data)
    } else {
      //Todo: call the create mutation
      console.warn('create', data)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <EditButton label="edit portfolio project" />
          ) : (
            <AddButton label="add portfolio project" />
          )}
        </DialogTrigger>
        <DialogContent
          className="flex h-[500px] w-[400px] flex-col overflow-auto sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">
                  {props.edit ? 'Edit portfolio project' : 'Add a new portfolio project'}
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
            <div className="flex-1 space-y-5 overflow-auto">
              <MediaBlock />
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

export default PortfolioForm
