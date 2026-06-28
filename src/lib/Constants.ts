import { FooterColumn } from '@/components/layout/Footer/FooterColumn'
import { NavItemConfig } from '@/types/nav'

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

export const NAV_ITEMS: NavItemConfig[] = [
  {
    label: 'How it Works',
    children: [
      { label: 'For Students', href: '/how-it-works/students' },
      { label: 'For Tutors', href: '/how-it-works/tutors' },
      { label: 'Pricing', href: '/how-it-works/pricing' },
    ],
  },
  {
    label: 'Find Mentors',
    children: [
      { label: 'Browse All', href: '/mentors' },
      { label: 'By Subject', href: '/mentors/subjects' },
      { label: 'Top Rated', href: '/mentors/top-rated' },
    ],
  },
  {
    label: 'Become a Tutor',
    children: [
      { label: 'Apply Now', href: '/become-tutor/apply' },
      { label: 'Requirements', href: '/become-tutor/requirements' },
    ],
  },
  {
    label: 'Categories',
    children: [
      { label: 'Mathematics', href: '/categories/math' },
      { label: 'Sciences', href: '/categories/sciences' },
      { label: 'Languages', href: '/categories/languages' },
      { label: 'Programming', href: '/categories/programming' },
    ],
  },
]
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Feedback', href: '/feedback' },
      { label: 'Trust, Safety & Security', href: '/trust' },
    ],
  },
  {
    id: 'support',
    links: [
      { label: 'Help & Support', href: '/help' },
      { label: 'Upwork Foundation', href: '/foundation' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    id: 'legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'CA Notice at Collection', href: '/ca-notice' },
      { label: 'Your Privacy Choices', href: '/privacy-choices' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    id: 'misc',
    links: [
      { label: 'Desktop App', href: '/desktop' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Do Not Sell My Info', href: '/do-not-sell' },
      { label: 'Release Notes', href: '/releases' },
    ],
  },
]
