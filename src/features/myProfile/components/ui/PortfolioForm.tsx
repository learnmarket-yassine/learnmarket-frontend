import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
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
import { PortfolioFormValues, portfolioSchema } from '../../schemas'
import EditButton from './EditButton'
import AddButton from './AddButton'
import MediaBlock, { ContentItem } from '@/components/ui/MediaBlock'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/ui/CustomInput'
import { Textarea } from '@/components/ui/textarea'
import SkillsInput from '@/components/ui/SkillInput'
import useCreatePortfolio from '../../hooks/useCreatePortfolio'
import useEditPortfolio from '../../hooks/useEditPortfolio'
import useAddPortfolioMedia from '../../hooks/useAddPortfolioMedia'
import useRemovePortfolioMedia from '../../hooks/useRemovePortfolioMedia'
import { mediaToContentItem } from '../../utils/portfolioMedia'
import EditIcon from '@/assets/EditIcon'

type PortfolioFormProps = {
  edit: boolean
  id?: string
  isLoading?: boolean
}

function PortfolioForm(props: PortfolioFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaItems, setMediaItems] = useState<ContentItem[]>([])

  const tutorProfile = useStore((state) => state.auth.user?.tutorProfile)

  const selectedPortfolio = tutorProfile?.portfolio.find((project) => project.id === props.id)

  const createPortfolio = useCreatePortfolio()
  const editPortfolio = useEditPortfolio()
  const addPortfolioMedia = useAddPortfolioMedia()
  const removePortfolioMedia = useRemovePortfolioMedia()

  const initialMediaItems = useMemo(
    () => (selectedPortfolio?.media ?? []).map(mediaToContentItem),
    [selectedPortfolio]
  )

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
  })

  const { handleSubmit, reset, formState, register, control } = form
  const { errors } = formState

  useEffect(() => {
    if (props.edit) {
      reset({
        title: selectedPortfolio?.title ?? '',
        description: selectedPortfolio?.description ?? '',
        role: selectedPortfolio?.role ?? '',
        skills: selectedPortfolio?.skills ?? [],
      })
    } else reset({ title: '', description: '', role: '', skills: [] })
  }, [props.edit, isOpen, reset, selectedPortfolio])

  const handleRemoveMediaItem = (item: ContentItem) => {
    if (item.mediaId && props.id) {
      removePortfolioMedia.mutate({ itemId: props.id, mediaId: item.mediaId })
    }
  }

  const onSubmit: SubmitHandler<PortfolioFormValues> = async (data) => {
    setIsSubmitting(true)
    try {
      const itemId =
        props.edit && props.id
          ? (await editPortfolio.mutateAsync({ id: props.id, payload: data })).id!
          : (await createPortfolio.mutateAsync(data)).id!

      const newMediaItems = mediaItems.filter((item) => !item.mediaId)
      await Promise.all(
        newMediaItems.map((item) => addPortfolioMedia.mutateAsync({ itemId, item }))
      )

      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save the portfolio project', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {props.edit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full border border-[#2563EB] text-[#2563EB]`}
            >
              <EditIcon className="size-4" />
            </Button>
          ) : (
            <AddButton label="add portfolio project" />
          )}
        </DialogTrigger>
        <DialogContent
          className="flex max-h-[90vh] w-[400px] flex-col space-y-6 sm:w-[425px] sm:min-w-[1200px]"
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
            className="flex min-h-0 flex-1 flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto">
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
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>
              <div className="grid w-full grid-cols-5 items-start gap-16">
                <div className="col-span-2 space-y-3">
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
                      error={errors.role?.message}
                      {...register('role')}
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
                      error={errors.description?.message}
                      {...register('description')}
                      maxLength={5000}
                    />
                  </div>
                  <div>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor="skills" className="text-base font-bold text-[#5E5E5E]">
                            Skills and deliverables {!props.edit && <span>*</span>}
                          </Label>
                          <SkillsInput
                            className="rounded-full"
                            error={errors.skills?.message}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            maxSkills={5}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <MediaBlock
                    key={isOpen ? 'open' : 'closed'}
                    initialItems={initialMediaItems}
                    onChange={setMediaItems}
                    onRemoveItem={handleRemoveMediaItem}
                  />
                </div>
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
                disabled={isSubmitting}
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
