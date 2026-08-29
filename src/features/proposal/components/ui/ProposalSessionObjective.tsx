import useLineClamp from '@/hooks/useLineClamp'
import { cn } from '@/lib/utils'
import { RichTextContent } from '@/components/ui/rich-text-content'

function ProposalSessionObjective({
  objective,
  className,
}: {
  objective?: string | null
  className?: string
}) {
  const {
    ref,
    isExpanded,
    isClampable,
    toggle,
    className: clampClassName,
  } = useLineClamp(objective, { lines: 3 })

  if (!objective) {
    return <p className="mt-1 text-sm italic text-[#6B7280]">No additional details</p>
  }

  return (
    <div className="mt-1">
      <RichTextContent
        ref={ref}
        html={objective}
        className={cn(`${clampClassName} text-sm text-[#6B7280]`, className)}
      />
      {isClampable && (
        <button
          type="button"
          onClick={toggle}
          className="text-xs font-semibold text-[#565A60] underline"
        >
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  )
}
export default ProposalSessionObjective
