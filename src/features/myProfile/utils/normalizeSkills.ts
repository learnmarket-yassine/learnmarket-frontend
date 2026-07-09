import { Skill } from '@/types/skill'

type SkillJoinRow = { skill: Skill }

export function flattenSkills(rows?: SkillJoinRow[] | Skill[]): Skill[] {
  if (!rows) return []
  return rows.map((row) => ('skill' in row ? row.skill : row))
}
