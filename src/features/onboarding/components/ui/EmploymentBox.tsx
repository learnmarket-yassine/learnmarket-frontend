import FolderIcon from '@/assets/FolderIcon'
import ConfirmModal from '@/components/layout/ConfirmModal'
import EmploymentForm from '@/features/myProfile/components/ui/EmploymentForm'
import useDeleteEmployment from '@/features/myProfile/hooks/useDeleteEmployment'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type EmploymentBoxProps = {
  id: string
  profileId?: string
  jobTitle: string
  company: string
  description?: string
  startDate: string
  endDate?: string
  current?: boolean
  city?: string
  country?: string
}

const EmploymentBox = ({
  id,
  jobTitle,
  company,
  startDate,
  endDate,
  current,
  city,
  country,
}: EmploymentBoxProps) => {
  const { handleDeleteEmployment, isPending } = useDeleteEmployment()

  return (
    <div className="h-[200px] w-[500px] rounded-3xl border border-[#E5E7EB] p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-6">
          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-[#143681]">
            <FolderIcon />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-[#111827]">{jobTitle}</h1>
            <p className="text-base font-medium text-[#374151]">
              <span>{company}</span> |{' '}
              <span>
                {format(startDate, 'PPP', { locale: fr })} -{' '}
                {endDate
                  ? format(endDate, 'PPP', { locale: fr })
                  : current
                    ? format(new Date(), 'PPP', { locale: fr })
                    : null}
              </span>
            </p>
            <p className="text-[#9CA3AF]">
              {city}, {country}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EmploymentForm id={id} edit />
          <ConfirmModal
            name="employment"
            type="delete"
            title={'Delete employment'}
            description={'Are you sure you want to delete this employment experience ?'}
            handleConfirm={() => handleDeleteEmployment(id)}
            buttonClassName="border-none"
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}

export default EmploymentBox
