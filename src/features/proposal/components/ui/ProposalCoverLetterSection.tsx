import ProposalSessionObjective from './ProposalSessionObjective'

type CoverLetterSectionProps = {
  message?: string | null
}

const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({ message }) => {
  if (!message) return null

  return (
    <div className="space-y-4">
      <p className="text-lg font-bold">Cover letter</p>
      <ProposalSessionObjective
        className="text-base font-medium text-[#1E293B]"
        objective={message}
      />
    </div>
  )
}

export default CoverLetterSection
