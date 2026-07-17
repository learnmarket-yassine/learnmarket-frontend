import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCreateLearnRequestDraft from '@/features/learn-requests/hooks/useCreateLearnRequestDraft'
import useUpdateLearnRequest from '@/features/learn-requests/hooks/useUpdateLearnRequest'
import EntryStep from '@/features/learn-requests/components/layout/FormSteps/EntryStep'
import TitleStep from '@/features/learn-requests/components/layout/FormSteps/TitleStep'
import SubjectStep from '@/features/learn-requests/components/layout/FormSteps/SubjectStep'
import LevelPreferencesStep from '@/features/learn-requests/components/layout/FormSteps/LevelPreferencesStep'
import BudgetStep from '@/features/learn-requests/components/layout/FormSteps/BudgetStep'
import DetailsStep from '@/features/learn-requests/components/layout/FormSteps/DetailsStep'
import ReviewStep from '@/features/learn-requests/components/layout/FormSteps/ReviewStep'
import WizardProgress from '@/features/learn-requests/components/ui/WizardProgress'
import WizardFooter from '@/features/learn-requests/components/ui/WizardFooter'
import {
  LearnRequestWizardState,
  StepHandle,
  UpdateLearnRequestPayload,
} from '@/features/learn-requests/store/types'
import { omitEmptyValues } from '@/lib/utils'

const ENTRY_STEP = 0
const REVIEW_STEP = 6

const FIELD_STEP_NUMBERS = [1, 2, 3, 4, 5] as const
type FieldStepNumber = (typeof FIELD_STEP_NUMBERS)[number]

type FieldStepConfig = {
  ref: React.RefObject<StepHandle | null>
  toPayload: (values: Record<string, unknown>) => UpdateLearnRequestPayload
}

type AddLearnRequestFormProps = {
  initialDraftId: string | null
  initialFormStep: number
  initialWizardState: LearnRequestWizardState
}

const AddLearnRequestForm = ({
  initialDraftId,
  initialFormStep,
  initialWizardState,
}: AddLearnRequestFormProps) => {
  const navigate = useNavigate()

  const { mutateAsync: createDraft } = useCreateLearnRequestDraft()
  const { mutateAsync: patchDraft } = useUpdateLearnRequest()

  const [draftId, setDraftId] = useState<string | null>(initialDraftId)
  const [formStep, setFormStep] = useState<number>(initialFormStep)
  const [wizardState, setWizardState] = useState<LearnRequestWizardState>(initialWizardState)

  const titleRef = useRef<StepHandle>(null)
  const subjectRef = useRef<StepHandle>(null)
  const levelRef = useRef<StepHandle>(null)
  const budgetRef = useRef<StepHandle>(null)
  const detailsRef = useRef<StepHandle>(null)

  const fieldSteps: Record<FieldStepNumber, FieldStepConfig> = {
    1: { ref: titleRef, toPayload: (v) => ({ title: v.title as string }) },
    2: {
      ref: subjectRef,
      toPayload: (v) => ({ categoryId: v.categoryId as string, skillIds: v.skillIds as string[] }),
    },
    3: {
      ref: levelRef,
      toPayload: (v) => ({
        level: v.level as UpdateLearnRequestPayload['level'],
        preferredLanguages: v.preferredLanguages as string[],
        requestedFrequency: v.requestedFrequency as number | null,
      }),
    },
    4: {
      ref: budgetRef,
      toPayload: (v) => ({ budgetMin: v.budgetMin as number, budgetMax: v.budgetMax as number }),
    },
    5: { ref: detailsRef, toPayload: (v) => ({ description: v.description as string }) },
  }
  const totalFieldSteps = FIELD_STEP_NUMBERS.length

  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({})
  const setStepValid = useCallback((step: number, isValid: boolean) => {
    setStepValidity((prev) => (prev[step] === isValid ? prev : { ...prev, [step]: isValid }))
  }, [])

  const isFieldStep = (step: number): step is FieldStepNumber => step in fieldSteps
  const isCurrentStepValid = isFieldStep(formStep) ? !!stepValidity[formStep] : true

  const handleSaveCurrentStep = async (): Promise<boolean> => {
    if (!isFieldStep(formStep)) return true
    const ref = fieldSteps[formStep].ref
    if (!ref.current) return true
    const ok = await ref.current.submit()
    if (!ok) return false
    setWizardState((prev) => ({ ...prev, ...ref.current!.getValues() }))
    return true
  }

  const handleNext = async () => {
    const ok = await handleSaveCurrentStep()
    if (!ok) return
    setFormStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setFormStep((prev) => Math.max(ENTRY_STEP, prev - 1))
  }

  const handleSelectType = (type: LearnRequestWizardState['type']) => {
    setWizardState((prev) => ({ ...prev, type }))
    if (draftId) {
      patchDraft({ id: draftId, payload: { type: type ?? undefined } })
    }
    setFormStep(1)
  }

  const handleDraftCreated = (id: string) => {
    setDraftId(id)
    navigate(`/learn-request/edit/${id}`, { replace: true })
  }

  const handleSaveDraft = async () => {
    if (formStep === REVIEW_STEP) {
      navigate('/profile')
      return
    }

    const ref = isFieldStep(formStep) ? fieldSteps[formStep].ref : null
    const values = ref?.current?.getValues() ?? {}
    setWizardState((prev) => ({ ...prev, ...values }))

    try {
      if (draftId) {
        if (isFieldStep(formStep)) {
          const payload = omitEmptyValues(fieldSteps[formStep].toPayload(values))
          if (Object.keys(payload).length > 0) {
            await patchDraft({ id: draftId, payload })
          }
        }
      } else if (formStep === 1) {
        const title = (values.title as string | undefined) ?? ''
        if (wizardState.type && title.trim()) {
          const created = await createDraft({ type: wizardState.type, title })
          setDraftId(created.id)
        }
      }
      navigate('/profile')
    } catch {
      // stay on the page — nothing else to persist without a toast system
    }
  }

  const saveDraftDisabled = formStep === 1 && !draftId && !stepValidity[1]

  const steps = [
    {
      stepNumber: ENTRY_STEP,
      component: <EntryStep selectedType={wizardState.type} onSelectType={handleSelectType} />,
      show: true,
    },
    {
      stepNumber: 1,
      component: (
        <TitleStep
          ref={titleRef}
          draftId={draftId}
          type={wizardState.type}
          defaultTitle={wizardState.title}
          onValidityChange={(v) => setStepValid(1, v)}
          onDraftCreated={handleDraftCreated}
        />
      ),
      show: true,
    },
    {
      stepNumber: 2,
      component: (
        <SubjectStep
          ref={subjectRef}
          draftId={draftId as string}
          defaultCategoryId={wizardState.categoryId}
          defaultSkills={wizardState.skills}
          onValidityChange={(v) => setStepValid(2, v)}
        />
      ),
      show: true,
    },
    {
      stepNumber: 3,
      component: (
        <LevelPreferencesStep
          ref={levelRef}
          draftId={draftId as string}
          type={wizardState.type}
          defaultValues={{
            level: wizardState.level,
            preferredLanguages: wizardState.preferredLanguages,
            requestedFrequency: wizardState.requestedFrequency,
          }}
          onValidityChange={(v) => setStepValid(3, v)}
        />
      ),
      show: true,
    },
    {
      stepNumber: 4,
      component: (
        <BudgetStep
          ref={budgetRef}
          draftId={draftId as string}
          defaultBudgetMin={wizardState.budgetMin}
          defaultBudgetMax={wizardState.budgetMax}
          onValidityChange={(v) => setStepValid(4, v)}
        />
      ),
      show: true,
    },
    {
      stepNumber: 5,
      component: (
        <DetailsStep
          ref={detailsRef}
          draftId={draftId as string}
          defaultDescription={wizardState.description}
          onValidityChange={(v) => setStepValid(5, v)}
        />
      ),
      show: true,

      name: 'write a bio',
      canSkip: false,
    },
    {
      stepNumber: REVIEW_STEP,
      component: (
        <ReviewStep
          draftId={draftId as string}
          onEdit={setFormStep}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          onPublished={() => navigate('/profile')}
        />
      ),
      show: true,
    },
  ]
  // Filter steps based on show conditions
  const visibleSteps = steps.filter((step) => step.show)

  const currentStepComponent =
    visibleSteps.find((step) => step.stepNumber === formStep)?.component || null

  return (
    <form
      className="flex flex-grow flex-col space-y-3"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className="flex flex-1 flex-col space-y-6">
        <div className="container flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-col space-y-6">
            <div className="flex flex-1 flex-col">{currentStepComponent}</div>
            {!(formStep === ENTRY_STEP || formStep === REVIEW_STEP) && (
              <>
                <WizardProgress currentStep={formStep} totalSteps={totalFieldSteps} />
                <WizardFooter
                  onBack={handleBack}
                  onSaveDraft={handleSaveDraft}
                  onNext={handleNext}
                  nextDisabled={!isCurrentStepValid}
                  saveDraftDisabled={saveDraftDisabled}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddLearnRequestForm
