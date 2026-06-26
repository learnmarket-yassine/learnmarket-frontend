import GoogleIcon from '@/assets/GoogleIcon'

const GoogleButton = () => {
  return (
    <button
      type="submit"
      data-mdb-button-init
      data-mdb-ripple-init
      className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white p-4 hover:bg-white"
    >
      <GoogleIcon />
      <span className="text-sm font-medium text-[#2563EB]">Continue with Google</span>
    </button>
  )
}

export default GoogleButton
