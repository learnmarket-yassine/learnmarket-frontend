import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProposalSessionPlan } from '../../store/types'
import ProposalSessionObjective from './ProposalSessionObjective'

type ProposalSessionsSectionProps = {
  sessions?: ProposalSessionPlan[]
}
const ProposalSessionsSection: React.FC<ProposalSessionsSectionProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-lg font-bold text-[#1E293B]">Sessions plan</p>
        <p className="text-sm text-[#6B7280]">No session plan available.</p>
      </div>
    )
  }

  const isSingleSession = sessions.length === 1

  return (
    <div className="space-y-4">
      <p className="text-lg font-bold">Sessions plan</p>
      {isSingleSession ? (
        <div className="rounded-2xl border border-[#E0E2E6] p-4">
          <p className="font-semibold text-[#1E293B]">{sessions[0].title}</p>
          <ProposalSessionObjective objective={sessions[0].objective} />
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {sessions.map((session) => (
            <AccordionItem key={session.sessionNumber} value={String(session.sessionNumber)}>
              <AccordionTrigger className="font-medium text-[#1E293B]">
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                    {session.sessionNumber}
                  </span>
                  {session.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9">
                <ProposalSessionObjective objective={session.objective} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

export default ProposalSessionsSection
