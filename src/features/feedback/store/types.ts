export interface Feedback {
  id: string
  proposalId: string
  authorId: string
  aboutUserId: string
  rating: number
  comment: string | null
  createdAt: string
}

export interface HiddenFeedback {
  id: string
  authorId: string
  aboutUserId: string
  status: 'hidden'
}

export type FeedbackEntry = Feedback | HiddenFeedback

export function isHiddenFeedback(entry: FeedbackEntry): entry is HiddenFeedback {
  return (entry as HiddenFeedback).status === 'hidden'
}

export interface SubmitFeedbackInput {
  rating: number
  comment?: string
}

export interface TutorRatingSummary {
  averageRating: number | null
  reviewCount: number
}
