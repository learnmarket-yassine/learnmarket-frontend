import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
import { SkillsFormValues, skillsSchema } from '../../schemas'
import EditButton from './EditButton'
import useReplaceTutorSkills from '../../hooks/useReplaceTutorSkills'
import SkillsInput from './Skills/SkillsInput'

function SkillsForm() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: replaceTutorSkillsMutation, isPending: editLoading } =
    useReplaceTutorSkills()

  const user = useStore((state) => state.auth.user)

  const selectedSkills = user?.tutorProfile?.skills

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
  })

  const { handleSubmit, formState, control, reset } = form
  const { errors } = formState

  useEffect(() => {
    reset({
      skills: selectedSkills ?? [],
    })
  }, [isOpen, reset, selectedSkills])

  const onSubmit: SubmitHandler<SkillsFormValues> = async (data) => {
    try {
      await replaceTutorSkillsMutation(data.skills)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save skills', error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit employment" />
        </DialogTrigger>
        <DialogContent
          className="flex min-h-[350px] w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Edit Skills</span>
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
            className="flex flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="flex-1 overflow-auto">
              <div>
                <Controller
                  name="skills"
                  control={control}
                  rules={{
                    validate: (v) => v.length > 0 || 'Add at least one skill',
                  }}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-semibold text-[#1F2937]">
                        Skills
                      </Label>
                      <SkillsInput
                        className="rounded-full"
                        error={errors.skills?.message}
                        value={field.value}
                        onChange={field.onChange}
                        maxSkills={10}
                      />
                    </div>
                  )}
                />
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
                disabled={editLoading}
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

export default SkillsForm
