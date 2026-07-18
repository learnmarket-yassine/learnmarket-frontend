import React from 'react'
import TutorCard, { TutorPreview } from '../ui/TutorCard'
import { Link } from 'react-router-dom'

type TutorSectionProps = {
  myTutors: TutorPreview[]
}

const TutorSection: React.FC<TutorSectionProps> = ({ myTutors }) => {
  return (
    <section className="flex flex-col space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1E293B]">Your tutors</h2>
        <Link
          to="/learning-requests"
          className="px-4 text-base font-bold text-[#143681] hover:underline"
        >
          View all tutors
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {myTutors.map((tutor) => (
          <TutorCard key={tutor.id} {...tutor} />
        ))}
      </div>
    </section>
  )
}

export default TutorSection
