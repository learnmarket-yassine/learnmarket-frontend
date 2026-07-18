import { useState } from 'react'
import LearnerAccueilPageLayout from '@/features/Accueil/components/layout/LearnerAccueilLayout'
import LearnRequestSection, {
  PillFilter,
} from '@/features/Accueil/components/layout/LearnRequestSection'
import { TutorPreview } from '@/features/Accueil/components/ui/TutorCard'
import TutorSection from '@/features/Accueil/components/layout/TutorSection'
import useGetLearnRequests, {
  LearnRequestFilters,
} from '@/features/learn-requests/hooks/useGetLearnRequests'

const filtersForPill = (pill: PillFilter): LearnRequestFilters => {
  switch (pill) {
    case 'IN_PROGRESS':
      return { status: ['OPEN', 'CLOSED'] }
    case 'ACTION_NEEDED':
      return { actionNeeded: true }
    case 'DRAFTS':
      return { status: ['DRAFT'] }
    default:
      return {}
  }
}

const myTutors: TutorPreview[] = [
  {
    id: '1',
    name: 'Sarah V.',
    country: 'United States',
    rate: 24,
    rating: 5.0,
    sessions: 12,
    currentCourse: 'Conversational Spanish for beginners',
  },
  {
    id: '2',
    name: 'Marco G.',
    country: 'Italy',
    rate: 32,
    rating: 4.9,
    sessions: 8,
    currentCourse: 'React & TypeScript advanced patterns',
  },
  {
    id: '3',
    name: 'James L.',
    country: 'United Kingdom',
    rate: 18,
    rating: 4.8,
    sessions: 5,
    currentCourse: 'Calculus II exam prep',
  },
]

const LearnerAccueilPage = () => {
  const [activeFilter, setActiveFilter] = useState<PillFilter>('ALL')
  const { data } = useGetLearnRequests(filtersForPill(activeFilter))
  const myLearningRequests = data?.pages.flatMap((page) => page.paginatedResult) ?? []

  return (
    <LearnerAccueilPageLayout>
      {/* ── Your learning requests ────────────────────────────────────── */}
      <LearnRequestSection
        myLearningRequests={myLearningRequests}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* ── Your tutors ────────────────────────────────────────────────── */}
      <TutorSection myTutors={myTutors} />
    </LearnerAccueilPageLayout>
  )
}

export default LearnerAccueilPage
