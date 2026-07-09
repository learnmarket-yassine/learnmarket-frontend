import { Specialty } from '@/types/category'

type SpecialtyJoinRow = { specialty: Specialty }

export function flattenSpecialties(rows?: SpecialtyJoinRow[] | Specialty[]): Specialty[] {
  if (!rows) return []
  return rows.map((row) => ('specialty' in row ? row.specialty : row))
}
