// features/auth/hooks/usePasswordValidation.ts

import { PASSWORD_RULES } from '@/lib/Constants'

export const usePasswordValidation = (password: string) => {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }))

  const isValid = results.every((r) => (r.isError ? !r.passed : r.passed))

  return { results, isValid }
}
