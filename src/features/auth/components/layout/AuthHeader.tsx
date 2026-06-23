import YoraLogo from '@/assets/YoraLogo'

type AuthHeaderProps = {
  title: string
}

const AuthHeader = (props: AuthHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <YoraLogo />
      <div className="rounded-[48px] bg-[#2563EB] px-8 py-4 text-center text-lg font-semibold text-white">
        {props.title}
      </div>
    </div>
  )
}

export default AuthHeader
