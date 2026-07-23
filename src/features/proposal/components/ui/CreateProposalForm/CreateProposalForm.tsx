import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFieldArray, useForm } from 'react-hook-form'
import { buildProposalSchema, ProposalFormValues } from '../../../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { LearnRequest } from '@/features/learn-requests/store/types'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useCreateProposal from '../../../hooks/useCreateProposal'
import ProposalJobDetailsCard from './ProposalJobDetailsCard'
import ProposalFormSessionsSection from './ProposalSessionsSection'
import { SERVICE_FEE_PERCENT } from '@/lib/Constants'
import ProposalTermsSection from './ProposalTermsSection'

type CreateProposalFormProps = {
  learnrequest: LearnRequest
}

const CreateProposalForm = ({ learnrequest }: CreateProposalFormProps) => {
  const schema = buildProposalSchema(learnrequest.type ?? 'ONE_TIME')
  const form = useForm<ProposalFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onChange',
    defaultValues: {
      sessionDurationMinutes: 60,
      totalPrice: undefined,
      payoutMethod: 'ON_COMPLETION',
      message: '',
      sessionPlans: [{ title: '', objective: '' }],
    },
  })
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sessionPlans',
  })
  const { register, handleSubmit, formState, watch, control } = form

  const { errors } = formState
  const navigate = useNavigate()
  const watchedTotalPrice = Number(watch('totalPrice') || 0)
  const learnerTotal = watchedTotalPrice * (1 + SERVICE_FEE_PERCENT)

  const { handleCreateProposal, isPending: createProposalLoading } = useCreateProposal()

  const isSingleSession = fields.length === 1

  const onSubmit = (values: ProposalFormValues) => {
    handleCreateProposal({
      learnRequestId: learnrequest.id,
      payload: { ...values, totalPrice: learnerTotal },
    })
  }
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)(e)
      }}
      className="space-y-8"
      noValidate
    >
      <h1 className="text-4xl font-bold text-[#1E293B]">Submit a proposal</h1>
      <div className="flex flex-col space-y-4 rounded-3xl border border-[#E0E2E6] bg-white p-5">
        <h3 className="text-xl font-bold">Proposal settings</h3>
        <p>This proposal requires 5 Connects</p>
        <p>When you submit this proposal, you'll have 50 Connects remaining.</p>
      </div>
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
          <Label
            htmlFor="learn-request-description"
            className="text-sm font-semibold text-[#374151]"
          >
            Cover Letter
          </Label>
          <Textarea
            id="description"
            {...register('message')}
            className="h-[200px] resize-none rounded-xl border border-[#6B7280] bg-white p-4"
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          onClick={() => navigate('/accueil')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={createProposalLoading}
        >
          {createProposalLoading ? 'Submitting...' : 'Submit proposal'}
        </Button>
      </div>
    </form>
  )
}

export default CreateProposalForm
