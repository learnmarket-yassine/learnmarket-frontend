import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
import { useStore } from '@/store/store'
import { EducationFormData, educationSchema } from '../../schemas'
import EditButton from './EditButton'
import AddButton from './AddButton'
import MediaBlock from '@/components/ui/MediaBlock'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/ui/CustomInput'
import { Textarea } from '@/components/ui/textarea'
import SkillsInput from '@/components/ui/SkillInput'

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

  const { handleSubmit, reset, formState, register, control } = form
  const { errors } = formState

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
          className="flex w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[1200px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">
                  {props.edit ? 'Edit Portfolio project' : 'Add a new portfolio project'}
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
            <DialogDescription>
              <p className="text-base text-[#5E5E5E]">
                All fields are required unless otherwise indicated.
              </p>
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 space-y-6 overflow-auto">
              <div>
                <Label htmlFor="title" className="text-base font-bold text-[#5E5E5E]">
                  Project title {!props.edit && <span>*</span>}
                </Label>
                <CustomInput
                  type="text"
                  id="title"
                  placeholder="Digital Marketing | Video Editing, Video Editing & Production, Logo"
                  className="rounded-full border border-[#6B7280] bg-white"
                  width="w-full"
                  error={errors.institution?.message}
                  {...register('institution')}
                />
              </div>
              <div className="flex w-full items-center gap-16">
                <div className="w-full space-y-3">
                  <div>
                    <Label htmlFor="role" className="text-base font-bold text-[#5E5E5E]">
                      Your role (optional)
                    </Label>
                    <CustomInput
                      type="text"
                      id="role"
                      placeholder="e.g., English teacher"
                      className="rounded-full border border-[#6B7280] bg-white"
                      width="w-full"
                      error={errors.institution?.message}
                      {...register('institution')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-base font-bold text-[#5E5E5E]">
                      Project description {!props.edit && <span>*</span>}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description"
                      className="h-20 resize-none rounded-xl border border-[#6B7280] bg-white p-4"
                      error={errors.degree?.message}
                      {...register('degree')}
                      maxLength={5000}
                    />
                  </div>
                  <div>
                    <Controller
                      name="institution"
                      control={control}
                      rules={{
                        validate: (v) => v.length > 0 || 'Add at least one skill',
                      }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor="skills" className="text-base font-bold text-[#5E5E5E]">
                            Skills and deliverables {!props.edit && <span>*</span>}
                          </Label>
                          <SkillsInput
                            className="rounded-full"
                            error={errors.institution?.message}
                            value={[]}
                            onChange={field.onChange}
                            maxSkills={5}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <MediaBlock />
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
                disabled={false}
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
