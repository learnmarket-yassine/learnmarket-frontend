import { Category } from '@/types/category'
import { Skill } from '@/types/skill'

export type LearnRequestType = 'ONE_TIME' | 'COURSE'
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type LearnRequestStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED' | 'REMOVED'

export interface LearnRequest {
  id: string
  learnerId: string
  status: LearnRequestStatus
  type: LearnRequestType | null
  title: string
  categoryId: string | null
  category: Category | null
  level: ProficiencyLevel | null
  description: string | null
  preferredLanguages: string[]
  requestedFrequency: number | null
  budgetMin: string | number | null
  budgetMax: string | number | null
  skills: { skill: Skill }[]
  actionNeeded: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateLearnRequestDraftPayload {
  type: LearnRequestType
  title: string
}

export interface UpdateLearnRequestPayload {
  title?: string
  type?: LearnRequestType
  categoryId?: string
  skillIds?: string[]
  level?: ProficiencyLevel
  preferredLanguages?: string[]
  requestedFrequency?: number | null
  budgetMin?: number
  budgetMax?: number
  description?: string
}

export interface LearnRequestWizardState {
  draftId: string | null
  type: LearnRequestType | null
  title: string
  categoryId: string | null
  skills: Skill[]
  level: ProficiencyLevel | null
  preferredLanguages: string[]
  requestedFrequency: number | null
  budgetMin: number | null
  budgetMax: number | null
  description: string
}

export const INITIAL_WIZARD_STATE: LearnRequestWizardState = {
  draftId: null,
  type: null,
  title: '',
  categoryId: null,
  skills: [],
  level: null,
  preferredLanguages: [],
  requestedFrequency: null,
  budgetMin: null,
  budgetMax: null,
  description: '',
}

export interface LearnRequestStats {
  requestCount: number
  hireRate: number
}

export interface StepHandle {
  submit: () => Promise<boolean>
  getValues: () => Record<string, unknown>
}
