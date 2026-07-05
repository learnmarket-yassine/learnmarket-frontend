import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MentorAvatar from '@/assets/images/onboarding-avatar.png'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarIcon, UserIcon } from 'lucide-react'

const OverviewStep = () => {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="space-y-6">
        <h1 className="max-w-[400px] text-4xl font-bold text-[#1E293B]">
          Great. Now write a bio to tell the world about yourself.
        </h1>
        <p className="max-w-[470px] text-sm text-[#4B5563]">
          Help people get to know you at a glance. What work do you do best? Tell them clearly,
          using paragraphs or bullet points. You can always edit later; just make sure you proofread
          now.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bio" className="text-base font-bold text-[#5E5E5E]">
            Profile overview <span>*</span>
          </Label>
          <Textarea
            id="bio"
            placeholder="Describe your strengths, skills and experience"
            className="h-[160px] resize-none rounded-xl border bg-white p-4"
            maxLength={5000}
          />
          <div className="flex justify-end">
            <p className="text-sm text-[#5E5E5E]">left</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-6 rounded-3xl border-[#E5E7EB] bg-[#f7f7f8] p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-28 w-28 after:border-none">
            <AvatarImage src={MentorAvatar} alt={'mentor avatar'} />
            <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
              mentor avatar
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-sm text-[#4B5563]">
              <StarIcon className="h-4 w-4" />
              5.0
            </p>
            <p className="flex items-center gap-2 text-sm text-[#4B5563]">$75.00/hr</p>
            <p className="flex items-center gap-2 text-sm text-[#4B5563]">
              <UserIcon className="h-4 w-4" />
              14 jobs
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="max-w-96 text-base font-medium text-[#1E293B]">
            I'm a developer experienced in building websites for small and medium-sized businesses.
            Whether you're trying to win work, list your services, or create a new online store, I
            can help.
          </p>
          <ul className="max-w-96 list-disc text-base font-medium text-[#1E293B]">
            <li>Knows HTML and CSS3, PHP, jQuery, Wordpress, and SEO</li>
            <li>Full project management from start to finish</li>
            <li>Regular communication is important to me, so let's keep in touch.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OverviewStep
