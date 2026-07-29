import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFieldArray, useForm } from 'react-hook-form'
import { buildProposalSchema, ProposalFormValues } from '../../../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useCreateProposal from '../../../hooks/useCreateProposal'
import useUpdateProposal from '../../../hooks/useUpdateProposal'
import ProposalJobDetailsCard from './ProposalJobDetailsCard'
import ProposalFormSessionsSection from './ProposalSessionsSection'
import ProposalTermsSection from './ProposalTermsSection'
import { MyProposalDetail } from '@/features/proposal/store/types'

type CreateProposalFormProps = {
  learnrequest: LearnRequest
  existingProposal?: MyProposalDetail
}

const CreateProposalForm = ({ learnrequest, existingProposal }: CreateProposalFormProps) => {
  const isEditMode = !!existingProposal
  const schema = buildProposalSchema(learnrequest.type ?? 'ONE_TIME')
  const form = useForm<ProposalFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onChange',
    defaultValues: {
      sessionDurationMinutes: 10,
      totalPrice: undefined,
      payoutMethod: 'ON_COMPLETION',
      message: '',
      sessionPlans: [{ title: '', objective: '' }],
    },
  })
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sessionPlans',
    keyName: 'fieldId',
  })
  const { register, handleSubmit, formState, watch, control, reset } = form

  const { errors } = formState
  const navigate = useNavigate()
  const watchedTotalPrice = Number(watch('totalPrice') || 0)

  useEffect(() => {
    if (!isEditMode || !existingProposal) return

    reset({
      sessionDurationMinutes: existingProposal.sessionDurationMinutes,
      totalPrice: existingProposal.tutorTotal,
      payoutMethod: existingProposal.payoutMethod,
      message: existingProposal.message ?? undefined,
      sessionPlans: existingProposal.sessionPlans.map((session) => ({
        id: session.id,
        title: session.title,
        objective: session.objective ?? undefined,
      })),
    })
  }, [isEditMode, existingProposal, reset])

  const { handleCreateProposal, isPending: createProposalLoading } = useCreateProposal()
  const { handleUpdateProposal, isPending: updateProposalLoading } = useUpdateProposal()
  const isPending = isEditMode ? updateProposalLoading : createProposalLoading

  const isSingleSession = fields.length === 1

  const onSubmit = (values: ProposalFormValues) => {
    const payload = {
      ...values,
      sessionPlans: values.sessionPlans.map(({ title, objective }) => ({
        title,
        objective,
      })),
    }
    if (isEditMode) {
      handleUpdateProposal({ proposalId: existingProposal.id, payload })
    } else {
      handleCreateProposal({ learnRequestId: learnrequest.id, payload })
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <h1 className="text-4xl font-bold text-[#1E293B]">
        {isEditMode ? 'Edit your proposal' : 'Submit a proposal'}
      </h1>
      <div className="rounded-3xl border border-[#E0E2E6]">
        <ProposalJobDetailsCard learnrequest={learnrequest} />
      </div>
      <ProposalFormSessionsSection
        learnRequestType={learnrequest.type}
        append={append}
        move={move}
        register={register}
        errors={errors}
        fields={fields}
        remove={remove}
      />
      <ProposalTermsSection
        control={control}
        register={register}
        errors={errors}
        isSingleSession={isSingleSession}
        totalPrice={watchedTotalPrice}
      />
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Additional details</h3>
        <div className="space-y-2">
          <Label htmlFor="proposal-message" className="text-sm font-semibold text-[#374151]">
            Cover Letter
          </Label>
          <Textarea
            id="proposal-message"
            {...register('message')}
            className="h-[200px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          onClick={() => navigate(isEditMode ? `/proposals/${existingProposal.id}` : '/accueil')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
        >
          {isPending
            ? isEditMode
              ? 'Saving...'
              : 'Submitting...'
            : isEditMode
              ? 'Save changes'
              : 'Submit proposal'}
        </Button>
      </div>
    </form>
  )
}

export default CreateProposalForm
