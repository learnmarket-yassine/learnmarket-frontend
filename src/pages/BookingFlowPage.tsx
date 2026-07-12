import BookingFlow from '@/features/scheduling/learner-booking/BookingFlow'
import { useParams } from 'react-router-dom'

const BookingFlowPage = () => {
  const { proposalId } = useParams<{ proposalId: string }>()
  if (!proposalId) return null
  return <BookingFlow proposalId={proposalId} />
}

export default BookingFlowPage
