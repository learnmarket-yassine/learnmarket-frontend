import { LearnRequestStatus, LearnRequestType, ProficiencyLevel } from '../store/types'

export const TYPE_LABELS: Record<LearnRequestType, string> = {
  ONE_TIME: 'One-time session',
  COURSE: 'Ongoing course',
}

export const LEVEL_LABELS: Record<ProficiencyLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

export const STATUS_LABELS: Record<LearnRequestStatus, string> = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  REMOVED: 'Removed',
}

export function formatLabel<T extends string>(
  labels: Record<T, string>,
  value: T | null | undefined
): string {
  return value ? labels[value] : 'Not set'
}
