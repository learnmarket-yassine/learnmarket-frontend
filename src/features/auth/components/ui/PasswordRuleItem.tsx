import { Check, X } from 'lucide-react'

type Props = {
  label: string
  passed: boolean
  isError: boolean
}

const PasswordRuleItem = ({ label, passed, isError }: Props) => {
  const isGreen = !isError && passed
  const isRed = isError && passed

  const color = isGreen ? 'text-[#31B652]' : isRed ? 'text-[#EC4750]' : 'text-[#8E949F]'

  return (
    <li className={`flex items-center gap-2 text-sm ${color}`}>
      {isError ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      <span>{label}</span>
    </li>
  )
}

export default PasswordRuleItem
