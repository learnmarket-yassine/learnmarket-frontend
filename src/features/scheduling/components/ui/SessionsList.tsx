import { Proposal, Session } from '../../types/dto'
import SessionItem from './SessionItem'

type SessionsListProps = {
  sessions: Session[]
  proposal: Proposal
  canSchedule?: boolean
}

const SessionsList = ({ sessions, proposal, canSchedule = true }: SessionsListProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white p-6">
      {sessions.map((session) => (
        <SessionItem session={session} proposal={proposal} canSchedule={canSchedule} />
      ))}
    </div>
  )
}

export default SessionsList
