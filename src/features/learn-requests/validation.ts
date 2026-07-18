import { LearnRequest, LearnRequestWizardState } from './store/types'
import { MAX_DESCRIPTION_LENGTH } from './schemas'

function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export type PublishErrorField =
  | 'title'
  | 'type'
  | 'category'
  | 'skills'
  | 'level'
  | 'languages'
  | 'frequency'
  | 'budget'
  | 'description'

export type PublishError = {
  field: PublishErrorField
  message: string
}

export function collectPublishErrors(state: LearnRequestWizardState): PublishError[] {
  const errors: PublishError[] = []

  if (!state.title.trim()) errors.push({ field: 'title', message: 'Title is required' })
  if (!state.type) errors.push({ field: 'type', message: 'Format is required' })
  if (!state.categoryId) errors.push({ field: 'category', message: 'Category is required' })
  if (state.skills.length === 0) {
    errors.push({ field: 'skills', message: 'At least one skill is required' })
  }
  if (!state.level) errors.push({ field: 'level', message: 'Level is required' })
  if (state.preferredLanguages.length === 0) {
    errors.push({ field: 'languages', message: 'At least one preferred language is required' })
  }

  if (state.type === 'COURSE') {
    if (!isPresent(state.requestedFrequency)) {
      errors.push({ field: 'frequency', message: 'Requested frequency is required for a course' })
    }
  } else if (state.type === 'ONE_TIME') {
    if (isPresent(state.requestedFrequency)) {
      errors.push({
        field: 'frequency',
        message: 'Requested frequency must be empty for a one-time session',
      })
    }
  }

  if (!isPresent(state.budgetMin)) {
    errors.push({ field: 'budget', message: 'Minimum budget is required' })
  } else if (state.budgetMin < 0) {
    errors.push({ field: 'budget', message: 'Minimum budget must be non-negative' })
  }

  if (!isPresent(state.budgetMax)) {
    errors.push({ field: 'budget', message: 'Maximum budget is required' })
  } else if (state.budgetMax < 0) {
    errors.push({ field: 'budget', message: 'Maximum budget must be non-negative' })
  }

  if (
    isPresent(state.budgetMin) &&
    isPresent(state.budgetMax) &&
    state.budgetMax < state.budgetMin
  ) {
    errors.push({
      field: 'budget',
      message: 'Maximum budget must be greater than or equal to the minimum',
    })
  }

  const description = state.description.trim()
  if (!description) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push({
      field: 'description',
      message: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
    })
  }

  return errors
}

export function isPublishable(state: LearnRequestWizardState): boolean {
  return collectPublishErrors(state).length === 0
}

export function mapLearnRequestToWizardState(dto: LearnRequest): LearnRequestWizardState {
  return {
    draftId: dto.id,
    type: dto.type,
    title: dto.title,
    categoryId: dto.categoryId,
    skills: dto.skills.map((s) => s.skill),
    level: dto.level,
    preferredLanguages: dto.preferredLanguages,
    requestedFrequency: dto.requestedFrequency,
    budgetMin: isPresent(dto.budgetMin) ? Number(dto.budgetMin) : null,
    budgetMax: isPresent(dto.budgetMax) ? Number(dto.budgetMax) : null,
    description: dto.description ?? '',
  }
}
