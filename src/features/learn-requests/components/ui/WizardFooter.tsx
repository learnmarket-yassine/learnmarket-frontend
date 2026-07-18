import { Button } from '@/components/ui/button'

type WizardFooterProps = {
  onBack: () => void
  onSaveDraft?: () => void
  onNext: () => void
  nextDisabled: boolean
  nextLabel?: string
  isSavingDraft?: boolean
  isNextLoading?: boolean
  saveDraftDisabled?: boolean
}

const WizardFooter = ({
  onBack,
  onSaveDraft,
  onNext,
  nextDisabled,
  nextLabel = 'Next',
  isSavingDraft = false,
  isNextLoading = false,
  saveDraftDisabled = false,
}: WizardFooterProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-5">
      <Button
        type="button"
        variant="outline"
        className="h-full rounded-full border-[#D1D5DB] px-8 py-[10px] font-semibold text-[#143681] hover:text-[#143681]"
        onClick={onBack}
      >
        Back
      </Button>
      <div className="flex items-center gap-8">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft || saveDraftDisabled}
            className="text-base font-semibold text-[#143681] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingDraft ? 'Saving...' : 'Save as draft'}
          </button>
        )}
        <Button
          type="button"
          disabled={nextDisabled || isNextLoading}
          className="h-full rounded-full bg-[#2563EB] px-8 py-[10px] font-semibold text-white hover:bg-[#2563EB] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onNext}
        >
          {isNextLoading ? 'Saving...' : nextLabel}
        </Button>
      </div>
    </div>
  )
}

export default WizardFooter
