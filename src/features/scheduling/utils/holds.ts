import type { SlotHold } from '../types/dto'

export function isHoldStillActive(hold: SlotHold): boolean {
  return hold.status === 'ACTIVE' && new Date(hold.expiresAt).getTime() > Date.now()
}
