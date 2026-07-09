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
import { useStore } from '@/store/store'
import { SpecialtiesFormValues, specialtiesSchema } from '../../schemas'
import EditButton from './EditButton'
import useReplaceTutorSpecialties from '../../hooks/useReplaceTutorSpecialties'
import CategorySpecialtyPicker from './Specialties/CategorySpecialtyPicker'

function SpecialtiesForm() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: replaceTutorSpecialtiesMutation, isPending: editLoading } =
    useReplaceTutorSpecialties()

  const user = useStore((state) => state.auth.user)

  const selectedSpecialties = user?.tutorProfile?.specialties

  const form = useForm<SpecialtiesFormValues>({
    resolver: zodResolver(specialtiesSchema),
  })

  const { handleSubmit, formState, control, reset } = form
  const { errors } = formState

  useEffect(() => {
    reset({
      specialties: selectedSpecialties ?? [],
    })
  }, [isOpen, reset, selectedSpecialties])

  const onSubmit: SubmitHandler<SpecialtiesFormValues> = async (data) => {
    try {
      await replaceTutorSpecialtiesMutation(data.specialties)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save specialties', error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <EditButton label="edit specialties" />
        </DialogTrigger>
        <DialogContent
          className="flex w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[750px]"
          style={{
            boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full items-center justify-between">
                <span className="text-4xl font-bold text-[#143681]">Edit Specialties</span>
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
            className="flex min-h-0 flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="min-h-0 flex-1 overflow-auto">
              <Controller
                name="specialties"
                control={control}
                render={({ field }) => (
                  <CategorySpecialtyPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.specialties?.message}
                  />
                )}
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

export default SpecialtiesForm
