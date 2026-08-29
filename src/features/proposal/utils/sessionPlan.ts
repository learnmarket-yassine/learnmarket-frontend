export function isObjectiveFilled(objective?: string | null): boolean {
  if (!objective) return false
  return objective.replace(/<[^>]*>/g, '').trim().length > 0
}

export function isSessionPlanComplete(title: string, objective?: string | null): boolean {
  return title.trim().length > 0 && isObjectiveFilled(objective)
}
