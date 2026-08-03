type SessionReportReasonBoxProps = {
  reason: string
  onSelect: (reason: string) => void
  selectedReason: string
}

const SessionReportReasonBox = ({
  reason,
  onSelect,
  selectedReason,
}: SessionReportReasonBoxProps) => {
  return (
    <div
      className={`cursor-pointer rounded-sm p-2 ${selectedReason === reason ? 'bg-[#EFF6FF]' : 'bg-[#F3F4F6]'}`}
      onClick={() => onSelect(reason)}
    >
      <p className="text-sm font-medium text-[#102A63]">{reason}</p>
    </div>
  )
}

export default SessionReportReasonBox
