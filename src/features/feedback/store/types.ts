export interface Feedback {
  id: string
  proposalId: string
  authorId: string
  aboutUserId: string
  rating: number
  comment: string | null
  createdAt: string
}

export interface SubmitFeedbackInput {
  rating: number
  comment?: string
}

export interface TutorRatingSummary {
  averageRating: number | null
  reviewCount: number
}

export interface TutorFeedbackEntry {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  author: {
    id: string
    firstname: string
    lastname: string
    avatar: string | null
  }
  learnRequestTitle: string
  engagementStart: string
  engagementEnd: string | null
  billedAmount: number | string
}
