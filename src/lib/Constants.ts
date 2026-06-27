// features/auth/constants/passwordRules.ts
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (v: string) => v.length >= 8,
    isError: false,
  },
  {
    id: 'numberOrSymbol',
    label: 'At least one number or symbol',
    test: (v: string) => /[\d!@#%^&*()_+\-=[\]{}':",./~]/.test(v),
    isError: false,
  },
  {
    id: 'upperAndLower',
    label: 'At least one uppercase and one lowercase letter',
    test: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v),
    isError: false,
  },
  {
    id: 'restricted',
    label: 'Restricted characters: ` \' " \\ ; | < > $',
    test: (v: string) => /[`'"\\;|<>$]/.test(v),
    isError: true,
  },
] as const
