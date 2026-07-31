import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import EmploymentForm from './EmploymentForm'
import ConfirmModal from '@/components/layout/ConfirmModal'
import useDeleteEmployment from '../../hooks/useDeleteEmployment'

interface EmploymentItemProps {
  id: string
  profileId?: string
  jobTitle: string
  company: string
  description?: string
  startDate: string
  endDate?: string
  current?: boolean
  readOnly?: boolean
}

function EmploymentItem({
  id,
  jobTitle,
  company,
  startDate,
  endDate,
  description,
  current = false,
  readOnly = false,
}: EmploymentItemProps) {
  const { handleDeleteEmployment, isPending } = useDeleteEmployment()
  return (
    <div className="space-y-8 py-8">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <p className="text-xl font-semibold text-[#143681]">
            {jobTitle} | {company}
          </p>
          <p className="text-base text-[#143681]">
            {format(startDate, 'PPP', { locale: fr })} -{' '}
            {endDate
              ? format(endDate, 'PPP', { locale: fr })
              : current
                ? format(new Date(), 'PPP', { locale: fr })
                : null}
          </p>
        </div>
        {!readOnly && (
          <div className="flex shrink-0 items-center gap-1">
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
        )}
      </div>
      <p className="text-base leading-relaxed text-[#143681]">{description}</p>
    </div>
  )
}
export default EmploymentItem
