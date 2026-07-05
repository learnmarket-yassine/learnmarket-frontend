import LinkedinIcon from '@/assets/LinkedinIcon'
import UploadIcon from '@/assets/UploadIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import MentorAvatar from '@/assets/images/onboarding-avatar.png'

const ImportDataStep = () => {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="space-y-6">
        <h1 className="max-w-[400px] text-4xl font-bold text-[#1E293B]">
          How would you like to tell us about yourself?
        </h1>
        <p className="max-w-[470px] text-sm text-[#4B5563]">
          We need to get a sense of your education, experience and skills. It's quickest to import
          your information — you can edit it before your profile goes live.
        </p>
        <div className="space-y-4">
          <Button
            variant={'outline'}
            data-mdb-button-init
            data-mdb-ripple-init
            className="flex h-full w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-4 hover:bg-white"
          >
            <LinkedinIcon />
            <span className="text-base font-semibold text-[#2563EB]">Import from LinkedIn</span>
          </Button>
          <Button
            variant={'outline'}
            data-mdb-button-init
            data-mdb-ripple-init
            className="flex h-full w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-4 hover:bg-white"
          >
            <UploadIcon />
            <span className="text-base font-semibold text-[#2563EB]">Upload your resume</span>
          </Button>
          <Button
            variant={'outline'}
            data-mdb-button-init
            data-mdb-ripple-init
            className="flex h-full w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-[#2563EB] bg-white px-6 py-4 hover:bg-white"
          >
            <span className="text-base font-semibold text-[#2563EB]">
              Fill out manually (15 min)
            </span>
          </Button>
        </div>
      </div>
      <div className="space-y-4 rounded-3xl bg-[#F3F3FE] p-8">
        <Avatar className="h-12 w-12 after:border-none">
          <AvatarImage src={MentorAvatar} alt={'mentor avatar'} />
          <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
            mentor avatar
          </AvatarFallback>
        </Avatar>
        <p className="max-w-96 text-lg font-medium text-[#1E293B]">
          "Your Yora profile is how you stand out from the crowd. It's what you use to win work, so
          let's make it a good one."
        </p>
        <p className="text-sm font-semibold text-[#6B7280]">Yora Learning Pro Tip</p>
      </div>
    </div>
  )
}

export default ImportDataStep
