import RoleBox from './RoleBox'

type RoleSwitcherProps = {
  role: 'TUTOR' | 'LEARNER' | null
  setRole: (role: 'TUTOR' | 'LEARNER') => void
}

export default function RoleSwitcher({ role, setRole }: RoleSwitcherProps) {
  return (
    <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full bg-[#E0E2E633]/20 px-6 py-3">
      <div className="flex gap-4">
        <RoleBox title="Tutor" onClick={() => setRole('TUTOR')} active={role === 'TUTOR'} />
        <RoleBox title="Learner" onClick={() => setRole('LEARNER')} active={role === 'LEARNER'} />
      </div>
    </div>
  )
}
