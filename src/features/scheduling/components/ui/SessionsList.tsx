import { Proposal, Session } from '../../types/dto'
import SessionItem from './SessionItem'

type SessionsListProps = {
  sessions: Session[]
  proposal: Proposal
}

const SessionsList = ({ sessions, proposal }: SessionsListProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white p-6">
      {sessions.map((session) => (
        <SessionItem session={session} proposal={proposal} />
      ))}
    </div>
  )
}

export default SessionsList
