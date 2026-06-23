import YoraLogo from '@/assets/YoraLogo'

type AuthHeaderProps = {
  buttonLabel: string
  onButtonClick: () => void
}

const AuthHeader = ({ buttonLabel, onButtonClick }: AuthHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <YoraLogo />
      <button
        onClick={onButtonClick}
        className="rounded-[48px] bg-[#2563EB] px-8 py-4 text-center text-lg font-semibold text-white"
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export default AuthHeader
