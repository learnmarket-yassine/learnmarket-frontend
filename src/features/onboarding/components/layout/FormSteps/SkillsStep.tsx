import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MentorAvatar from '@/assets/images/onboarding-avatar.png'
import { Label } from '@/components/ui/label'
import SkillsInput from '@/components/ui/SkillInput'

const SkillsStep = () => {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-[#1E293B]">
            Nearly there! What work are you here to do?
          </h1>
          <p className="max-w-[520px] text-sm text-[#4B5563]">
            Your skills show clients what you can offer, and help us choose which jobs to recommend
            to you. Add or remove the ones we've suggested, or start typing to pick more. It's up to
            you.
          </p>
          <p className="font-semibold text-[#2563EB]">Why choosing carefully matters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-sm font-semibold text-[#374151]">
            Your skills
          </Label>
          <SkillsInput className="h-20 rounded-lg" value={[]} onChange={() => {}} maxSkills={20} />
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
          "Yora's algorithm will recommend specific job posts to you based on your skills. So choose
          them carefully to get the best match!"
        </p>
        <p className="text-sm font-semibold text-[#6B7280]">Yora Learning Pro Tip</p>
      </div>
    </div>
  )
}

export default SkillsStep
