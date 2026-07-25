import React from 'react'
import { Session } from '../../types/dto'
import CourseStep from './CourseStep'

type CourseListProps = {
  sessions: Session[]
  activeSessionId?: string
  onSelectSession: (session: Session) => void
}

const CourseList: React.FC<CourseListProps> = ({ sessions, activeSessionId, onSelectSession }) => {
  const ordered = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)
  return (
    <div className="space-y-5 p-4">
      <h1 className="font-bold">Courses List</h1>
      <div className="flex flex-col gap-6">
        {ordered.map((session) => (
          <CourseStep
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onSelectSession={onSelectSession}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseList
