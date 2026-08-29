import { useMemo, useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFieldArrayUpdate,
} from 'react-hook-form'
import { ProposalFormValues } from '@/features/proposal/schemas'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/SearchInput'
import SessionRow from './SessionRow'
import SessionFormModal, { SessionFormValues } from './SessionFormModal'
import SessionReorderModal, { ReorderableSession } from './SessionReorderModal'
import LearnRequestPagination from '@/features/learn-requests/components/ui/LearnRequestPagination'

type SessionPlanField = FieldArrayWithId<ProposalFormValues, 'sessionPlans', 'fieldId'>

const PAGE_SIZE = 3

type ProposalFormSessionsSectionProps = {
  learnRequestType: string | null
  errors: FieldErrors<ProposalFormValues>
  fields: SessionPlanField[]
  append: UseFieldArrayAppend<ProposalFormValues, 'sessionPlans'>
  update: UseFieldArrayUpdate<ProposalFormValues, 'sessionPlans'>
  remove: UseFieldArrayRemove
  replace: UseFieldArrayReplace<ProposalFormValues, 'sessionPlans'>
}

const ProposalFormSessionsSection: React.FC<ProposalFormSessionsSectionProps> = ({
  learnRequestType,
  errors,
  fields,
  append,
  update,
  remove,
  replace,
}) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isReorderOpen, setIsReorderOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [openFieldId, setOpenFieldId] = useState<string | null>(null)

  const isOneTime = learnRequestType === 'ONE_TIME'
  const canManage = !isOneTime
  const canDelete = !isOneTime && fields.length > 1

  const indexed = useMemo(() => fields.map((field, index) => ({ field, index })), [fields])
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return indexed
    return indexed.filter(({ field }) => field.title.toLowerCase().includes(query))
  }, [indexed, search])

  // LearnRequestPagination (and page state below) are 0-indexed: page 0 is
  // the first page.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  const editingField = editingIndex !== null ? fields[editingIndex] : undefined

  const handleToggle = (fieldId: string) => {
    setOpenFieldId((current) => (current === fieldId ? null : fieldId))
  }

  const handleAddSave = ({ title, objective }: SessionFormValues) => {
    append({ title, objective })
    setSearch('')
    const newTotalPages = Math.max(1, Math.ceil((fields.length + 1) / PAGE_SIZE))
    setPage(newTotalPages - 1)
  }

  const handleEditSave = ({ title, objective }: SessionFormValues) => {
    if (editingIndex === null) return
    update(editingIndex, { ...fields[editingIndex], title, objective })
  }

  const handleReorderSave = (order: ReorderableSession[]) => {
    replace(order.map(({ id, title, objective }) => ({ id, title, objective })))
    setOpenFieldId(null)
  }

  return (
    <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
      <h3 className="text-xl font-bold">Sessions details</h3>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(0)
            }}
            onClear={() => {
              setSearch('')
              setPage(0)
            }}
            placeholder="Search sessions by title"
          />
        </div>
        {canManage && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsReorderOpen(true)}
            className="flex h-full items-center gap-2 rounded-full border border-[#004AC6] px-5 py-3 text-sm text-[#004AC6] hover:text-[#004AC6]"
          >
            <ArrowUpDown className="size-4" /> Reorder
          </Button>
        )}
        {canManage && (
          <Button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex h-full items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2563EB]"
          >
            <Plus className="size-4" /> Add session
          </Button>
        )}
      </div>

      <div className="h-[350px] overflow-y-auto">
        <div className="space-y-2">
          {pageItems.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center text-sm text-[#6B7280]">
              {search ? `No sessions match "${search}"` : 'No sessions yet.'}
            </div>
          ) : (
            pageItems.map(({ field, index }) => (
              <SessionRow
                key={field.fieldId}
                position={index + 1}
                index={index}
                id={field.id}
                title={field.title}
                objective={field.objective}
                isOpen={field.fieldId === openFieldId}
                canDelete={canDelete}
                onToggle={() => handleToggle(field.fieldId)}
                onEdit={() => setEditingIndex(index)}
                onDelete={() => {
                  if (field.fieldId === openFieldId) setOpenFieldId(null)
                  remove(index)
                }}
              />
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <LearnRequestPagination
            currentPage={currentPage}
            totalCount={filtered.length}
            take={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      {errors.sessionPlans?.message && (
        <p className="text-xs text-destructive">{errors.sessionPlans.message}</p>
      )}

      <SessionFormModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        mode="add"
        onSave={handleAddSave}
      />

      <SessionFormModal
        open={editingIndex !== null}
        onOpenChange={(open) => !open && setEditingIndex(null)}
        mode="edit"
        sessionNumber={editingIndex !== null ? editingIndex + 1 : undefined}
        initialTitle={editingField?.title}
        initialObjective={editingField?.objective}
        onSave={handleEditSave}
      />

      <SessionReorderModal
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        sessions={fields}
        onSave={handleReorderSave}
      />
    </div>
  )
}

export default ProposalFormSessionsSection
