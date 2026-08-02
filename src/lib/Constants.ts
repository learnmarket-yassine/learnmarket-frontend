import { FooterColumn } from '@/components/layout/Footer/FooterColumn'
import { LanguageLevel } from '@/features/myProfile/store/types'
import { SessionStatus } from '@/features/scheduling/types/enums'
import { SessionStatusConfig } from '@/features/sessions/components/ui/MeetingCard'
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
      { label: 'Community Guidelines', href: '/community' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    id: 'legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'California Privacy Notice', href: '/privacy/california' },
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
export const LANGUAGES = [
  { value: 'afrikaans', label: 'Afrikaans' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'amharic', label: 'Amharic' },
  { value: 'assamese', label: 'Assamese' },
  { value: 'azerbaijani', label: 'Azerbaijani' },
  { value: 'belarusian', label: 'Belarusian' },
  { value: 'bulgarian', label: 'Bulgarian' },
  { value: 'bhojpuri', label: 'Bhojpuri' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'bosnian', label: 'Bosnian' },
  { value: 'catalan', label: 'Catalan, Valencian' },
  { value: 'chinese_simplified', label: 'Chinese (Simplified)' },
  { value: 'chinese_traditional', label: 'Chinese (Traditional)' },
  { value: 'croatian', label: 'Croatian' },
  { value: 'czech', label: 'Czech' },
  { value: 'danish', label: 'Danish' },
  { value: 'dutch', label: 'Dutch' },
  { value: 'english', label: 'English' },
  { value: 'estonian', label: 'Estonian' },
  { value: 'finnish', label: 'Finnish' },
  { value: 'french', label: 'French' },
  { value: 'galician', label: 'Galician' },
  { value: 'georgian', label: 'Georgian' },
  { value: 'german', label: 'German' },
  { value: 'greek', label: 'Greek' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'hausa', label: 'Hausa' },
  { value: 'hebrew', label: 'Hebrew' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'hungarian', label: 'Hungarian' },
  { value: 'indonesian', label: 'Indonesian' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'kazakh', label: 'Kazakh' },
  { value: 'khmer', label: 'Khmer' },
  { value: 'korean', label: 'Korean' },
  { value: 'kyrgyz', label: 'Kyrgyz' },
  { value: 'latvian', label: 'Latvian' },
  { value: 'lithuanian', label: 'Lithuanian' },
  { value: 'macedonian', label: 'Macedonian' },
  { value: 'malay', label: 'Malay' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'mongolian', label: 'Mongolian' },
  { value: 'nepali', label: 'Nepali' },
  { value: 'norwegian', label: 'Norwegian' },
  { value: 'odia', label: 'Odia' },
  { value: 'pashto', label: 'Pashto' },
  { value: 'persian', label: 'Persian' },
  { value: 'polish', label: 'Polish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'romanian', label: 'Romanian' },
  { value: 'russian', label: 'Russian' },
  { value: 'serbian', label: 'Serbian' },
  { value: 'sinhala', label: 'Sinhala' },
  { value: 'slovak', label: 'Slovak' },
  { value: 'slovenian', label: 'Slovenian' },
  { value: 'somali', label: 'Somali' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'swahili', label: 'Swahili' },
  { value: 'swedish', label: 'Swedish' },
  { value: 'tagalog', label: 'Tagalog' },
  { value: 'tajik', label: 'Tajik' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'thai', label: 'Thai' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'turkmen', label: 'Turkmen' },
  { value: 'ukrainian', label: 'Ukrainian' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'uzbek', label: 'Uzbek' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'welsh', label: 'Welsh' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'zulu', label: 'Zulu' },
]
export const PROFICIENCY_LEVELS = [
  {
    value: 'BASIC',
    label: 'Basic',
    description: 'I am only able to communicate in this language through written communication',
  },
  {
    value: 'CONVERSATIONAL',
    label: 'Conversational',
    description:
      'I know this language well enough to verbally discuss project details with a client',
  },
  {
    value: 'FLUENT',
    label: 'Fluent',
    description: 'I have complete command of this language with perfect grammar',
  },
  {
    value: 'NATIVE_OR_BILINGUAL',
    label: 'Native or Bilingual',
    description:
      'I have complete command of this language, including breadth of vocabulary, idioms, and colloquialisms',
  },
]

export const languageLevelLabels: Record<LanguageLevel, string> = {
  BASIC: 'basic',
  CONVERSATIONAL: 'conversational',
  FLUENT: 'fluent',
  NATIVE_OR_BILINGUAL: 'native',
}

export const SERVICE_FEE_PERCENT = 0.1

export const SESSION_REPORT_REASONS = [
  'Tutor No Show',
  'Audio/Video Issues',
  'Session Content Not As Described',
  'Inappropriate Behavior',
]

export const SESSION_STATUS_CONFIG: Record<SessionStatus, SessionStatusConfig> = {
  LOCKED: { label: 'Locked', badgeBg: 'bg-slate-100', badgeText: 'text-slate-600' },
  PENDING_SCHEDULE: {
    label: 'Ready to schedule',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-[#2563EB]',
  },
  HELD: { label: 'Pending confirmation', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700' },
  BOOKED: { label: 'Booked', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  PENDING_REVIEW: {
    label: 'Awaiting review',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
  },
  COMPLETED: { label: 'Completed', badgeBg: 'bg-slate-200', badgeText: 'text-slate-700' },
  CANCELLED: { label: 'Cancelled', badgeBg: 'bg-red-100', badgeText: 'text-red-700' },
}
